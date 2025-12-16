use axum::{extract::State, Json};
use std::sync::{Arc, RwLock};
use crate::bodyguard_interfaces::{RegisteredServices, Service};
use crate::AppState;

pub async fn register_handler(
     State(state): State<AppState>,
    Json(service): Json<Service>,
) -> &'static str {
    {
        let services = state.services.read().unwrap();
        for fetched_service in services.services.iter() {
            println!("Service name: {}", fetched_service.name);
            println!("Service id: {}", fetched_service.id);
            if fetched_service.id == service.id {
            return  "Service already registered"
            }

        }
    }
    let mut services = state.services.write().unwrap();
    services.services.push(service.clone());
    services.count = services.services.len() as u32;

    let _ = state.tx.send(service);
    "service registered"
}


pub async fn fetch_registered(
    State(state): State<AppState>,
) -> axum::Json<RegisteredServices> {
    let services = state.services.read().unwrap();
    axum::Json(services.clone())
}