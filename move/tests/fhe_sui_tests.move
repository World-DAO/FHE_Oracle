#[test_only]
module fhe_sui::fhe_sui_tests;

use fhe_sui::{request, acl};
use sui::dynamic_field as df;
use sui::test_scenario as ts;

#[test]
public fun test_init(){
  let ctx = @fhe_sui::fhe_sui_tests::test_init();
  acl::init(&mut ctx);
}

#[test]
public fun test_create_request(){
  let ctx = @fhe_sui::fhe_sui_tests::test_init();
  acl::init(&mut ctx);
}
