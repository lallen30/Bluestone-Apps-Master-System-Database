mod bodyguard_interfaces;
use std::sync::{Arc, RwLock};

use axum:: {
    routing::get,
    routing::put,
    routing::post,
    Router,
};
use tokio::sync::broadcast;

use crate::bodyguard_interfaces::AppState;
use tower_http::cors::{CorsLayer, Any};
use axum::http::Method;
mod controllers;

#[tokio::main]
async fn main() {

    let cors = CorsLayer::new()
    .allow_origin(Any) // allow any origin (dev mode)
    .allow_methods([
        Method::GET,
        Method::POST,
        Method::PUT,
        Method::DELETE,
    ])
    .allow_headers(Any);

    let services = Arc::new(RwLock::new(bodyguard_interfaces::RegisteredServices {
       count: 0,
       services: Vec::new(),
    })); //storage container for services

    let (tx, _ ) = broadcast::channel(100); //ring buff of 100 events

    let state = AppState {
        services,
        tx,
    }; //store container and ring buffer in app state.

    let app = Router::new()
    .route("/services/register", post(controllers::register_controller::register_handler))
    .route("/health", get(controllers::health_controller::i_am))
    .route("/services", get(controllers::register_controller::fetch_registered))
    .route("/ws", get(controllers::ws_controller::ws_handler))
    .with_state(state)
    .layer(cors); 

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3032").await.unwrap();

    axum::serve(listener, app).await.unwrap();
}
 