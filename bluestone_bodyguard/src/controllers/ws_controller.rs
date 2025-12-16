use axum::{
    extract::{State, WebSocketUpgrade},
    response::IntoResponse
};
use axum::extract::ws::{WebSocket, Message};
use crate::AppState;

pub async fn ws_handler(
    ws: WebSocketUpgrade,
    State(state): State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(|socket| handle_socket(socket, state))
}


async fn handle_socket(mut socket: WebSocket, state: AppState) {
    let mut rx = state.tx.subscribe();

    while let Ok(service) = rx.recv().await {
        if let Ok(text) = serde_json::to_string(&service) {
            if socket.send(Message::Text(text.into())).await.is_err() {
                break;
            }
        }
    }
}