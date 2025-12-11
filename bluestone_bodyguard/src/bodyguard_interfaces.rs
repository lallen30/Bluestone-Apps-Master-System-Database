use std::sync::{Arc, RwLock};

use serde::{Serialize, Deserialize};
use tokio::sync::broadcast;

use crate::bodyguard_interfaces;


#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GatewayMessage {
    pub version: u16,
    pub id: String,
    pub trace_id: String,
    pub timestamp_ms: u64,

    pub source: Endpoint,
    pub destination: Endpoint,

    pub kind: MessageKind,
    pub r#type: String,

    pub auth: Option<AuthContext>,
    pub payload: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Endpoint {
    pub kind: EndpointKind,
    pub name: String,
    pub url: String,
    pub instance_id: Option<String>,
    pub params: Option<Params>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Params {
    // add fields later
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EndpointKind {
    App,
    Gateway,
    Service,
    Main,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum MessageKind {
    Request,
    Response,
    Event,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuthContext {
    pub user_id: String,
    pub tenant_id: String,
    pub roles: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Service {
    pub  name: String,
    pub  id: String,
    pub  version: u16,
    pub  description: String,
    pub  endpoints: Vec<Endpoint>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisteredServices {
    pub count: u32,
    pub services: Vec<Service>
}

#[derive(Clone)]
pub struct AppState {
    pub services: Arc<RwLock<bodyguard_interfaces::RegisteredServices>>,
    pub tx: broadcast::Sender<bodyguard_interfaces::Service>
}