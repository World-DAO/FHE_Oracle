module fhe_sui::request;

use fhe_sui::acl::{Self, RequestCap, CalculationCap};
use sui::dynamic_field as df;
use sui::event;

public enum RequestStatus has store, copy, drop{
  PENDING,
  PROCESSED,
  FAILED,
}

public enum RequestType has store, copy, drop{
  FHE_ADD,
  FHE_MULTIPLY,
  Decryption,
  FHE_ADD_CONST,
  FHE_SUB_CONST
}

// structs
public struct Registry has key {
  id: UID,
}

public struct Request has key, store{
  id: UID,
  status: RequestStatus,
  request_type: RequestType,
  input: vector<u8>,
  number_of_inputs: u8,
  result: Option<vector<u8>>,
}

// evnets
public struct RequestCreated has copy, drop {
  request_id: ID,
  request_type: RequestType,
}

public struct RequestProcessed has copy, drop {
  request_id: ID,
  request_type: RequestType,
  status: RequestStatus,
}

// init
fun init(ctx: &mut TxContext){
  transfer::share_object(
    Registry {
      id: object::new(ctx),
    }
  );
}

// functions
public fun create_request(ctx: &mut TxContext, request_type: RequestType, input: vector<u8>, 
number_of_inputs: u8, registry: &mut Registry){
  // should check the number of inputs
  let request = Request {
    id: object::new(ctx),
    status: RequestStatus::PENDING,
    request_type,
    input,
    number_of_inputs,
    result: option::none<vector<u8>>(),
  };
  let id = request.id.to_inner();
  df::add(&mut registry.id, id, request);
  event::emit(RequestCreated {
    request_id: id,
    request_type,
  });
  let sender = ctx.sender();
  acl::create_request_cap(ctx, id, sender);
}

public fun process_request(id: ID, registry: &mut Registry, result: vector<u8>,
_: &CalculationCap, state: RequestStatus){
  let request: &mut Request = df::borrow_mut(&mut registry.id, id);
  request.status = state;
  request.result = option::some(result);
  event::emit(RequestProcessed {
    request_id: request.id.to_inner(),
    request_type: request.request_type,
    status: request.status,
  });
}

public fun fetch_result(id: ID, registry: &mut Registry, cap: RequestCap): Option<vector<u8>>{
  let request: Request = df::remove(&mut registry.id, id);
  let cap_id = acl::get_id(&cap);
  assert!(cap_id == id, 0);
  acl::delete_request_cap(cap);
  assert!(request.status == RequestStatus::PROCESSED, 0);
  let result = request.result;
  let Request {id: uid, ..} = request;
  object::delete(uid);
  result
}