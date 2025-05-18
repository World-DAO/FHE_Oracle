module fhe_sui::acl;

public struct RequestCap has key {
  id: UID,
  request_id: ID
}

public struct CalculationCap has key {
  id: UID
}

public struct AdminCap has key {
  id: UID
}

fun init(ctx: &mut TxContext){
  transfer::transfer(
    AdminCap {
      id: object::new(ctx),
    },
    ctx.sender()
  );
}

public(package) fun give_calculation_cap(ctx: &mut TxContext, _: &mut AdminCap, target: address){
  transfer::transfer(
    CalculationCap {
      id: object::new(ctx),
    },
    target
  );
}

public(package) fun create_request_cap(ctx: &mut TxContext, id: ID, target: address){
  transfer::transfer(
    RequestCap {
      id: object::new(ctx),
      request_id: id
    },
    target
  );
}

public(package) fun delete_request_cap(cap: RequestCap){
  let RequestCap {id, ..} = cap;
  object::delete(id);
}

public fun get_id(cap: &RequestCap): ID{
  cap.request_id
}
