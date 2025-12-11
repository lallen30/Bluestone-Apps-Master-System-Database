# Bodyguard Message Protocol

This repository defines the canonical message format used by **Bodyguard**, a middleware service responsible for routing, tracing, and securing messages between client applications, internal services, and the main server.

This protocol is language-agnostic and transport-agnostic. It is designed to work over WebSockets, HTTP, message queues, or any other reliable transport.

---

## Core Design Goals

- Strong guarantees around **traceability**
- Clear **source → destination routing**
- Explicit **message intent**
- Optional but standardized **authentication context**
- Fully **extensible payload**
- Safe for use in **distributed microservice systems**

---

## Message Envelope Structure

Every message passed through Bodyguard must conform to the following top-level schema.

### Logical Fields

| Field          | Type              | Description                                                 |
| -------------- | ----------------- | ----------------------------------------------------------- |
| `version`      | number            | Protocol version. Start at `1`.                             |
| `id`           | string (UUID v4)  | Globally unique message ID.                                 |
| `trace_id`     | string (UUID v4)  | Stable ID used for end-to-end distributed tracing.          |
| `timestamp_ms` | number            | Unix epoch timestamp in milliseconds.                       |
| `source`       | object            | Describes where the message originated.                     |
| `destination`  | object            | Describes where the message should be routed.               |
| `kind`         | string            | One of: `request`, `response`, `event`, `error`.            |
| `type`         | string            | Semantic meaning of the message (namespaced).               |
| `auth`         | object (optional) | Authentication and tenancy context injected by the gateway. |
| `payload`      | object            | The actual business data for the message.                   |

---

## Source Object

Describes the origin of the message.

| Field | Type | Description |
| `kind` | string | `app`, `service`, `gateway`, `system`, etc. |
| `name` | string | Logical name of the sender. |
| `instance_id` | string | null | Unique runtime instance identifier (device ID, pod ID, etc.). |

---

## Destination Object

Describes where the message should be routed.

| Field | Type | Description |
| `kind` | string | `service`, `gateway`, `broadcast`, etc. |
| `name` | string | Logical name of the target service. |
| `instance_id` | string | null | Optional specific instance target. |

If `instance_id` is `null`, routing is resolved by the gateway or service mesh.

---

## Message Kind

Defines the high-level category of the message.

- `request` – Client or service asking for an action
- `response` – Direct reply to a request
- `event` – Fire-and-forget system event
- `error` – Failure response or system fault

---

## Message Type

`type` defines the semantic intent of the message and should be **namespaced** using dot notation.

Examples:

- `auth.login`
- `avatar.generate`
- `billing.charge`
- `system.healthcheck`

---

## Auth Object (Optional)

Injected by trusted gateways. Services must **not** trust client-supplied auth.

| Field       | Type             | Description                    |
| ----------- | ---------------- | ------------------------------ |
| `user_id`   | string           | Authenticated user identifier. |
| `tenant_id` | string           | Tenant or organization ID.     |
| `roles`     | array of strings | Authorization roles.           |

---

## Payload

The `payload` object contains the actual business data for the message.

- Fully schema-owned by the message `type`
- Must be valid JSON
- Should never contain protocol-level fields

---

## Full Example Message

```json
{
  "version": 1,
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "trace_id": "4c1c4e0b-6d68-4c46-bc2b-9a53de07d3bb",
  "timestamp_ms": 1733430219123,

  "source": {
    "kind": "app",
    "name": "ios-client",
    "instance_id": "device-7a31"
  },

  "destination": {
    "kind": "service",
    "name": "avatar-service",
    "instance_id": null
  },

  "kind": "request",
  "type": "avatar.generate",

  "auth": {
    "user_id": "u_948213",
    "tenant_id": "t_77",
    "roles": ["user"]
  },

  "payload": {
    "prompt": "cyberpunk samurai",
    "style": "anime"
  }
}
```

---

## Validation Rules

- `id` and `trace_id` must be valid UUID v4
- `timestamp_ms` must be server-validated
- `version` must be supported by the gateway
- `kind` must be one of the defined enums
- `auth` must only be injected by trusted infrastructure

---

## Versioning Strategy

- Protocol updates must increment `version`
- Backward compatibility is expected within a major version
- Services must reject unsupported versions explicitly

---

## Security Notes

- Clients must never send `auth` directly
- Gateways are responsible for:

  - Identity injection
  - Role normalization
  - Tenant isolation

- Services must treat all inbound messages as untrusted until validated

---

## Status

This protocol is currently in **active design** and subject to evolution as routing, observability, and service discovery are implemented.

---

## License

Internal project – licensing to be defined.
