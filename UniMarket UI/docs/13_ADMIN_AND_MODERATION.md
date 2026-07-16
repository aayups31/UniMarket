# Admin and Moderation

## Principle

Moderation should be powerful internally and invisible publicly.

## Admin identity

The moderator account does not appear as a public seller, has no searchable profile, cannot rely on client-side role checks, and receives permissions from secure server-side role enforcement.

## Capabilities

- remove listing
- record reason
- view listing owner
- review reports
- restore listing
- preserve audit log
- suspend user later
- block prohibited categories later

## Delete flow

Require reason, confirmation, server-side authorization, and audit record.

## UI

Admin tools live in a separate protected interface. Do not show destructive actions in normal listing UI unless authorized.
