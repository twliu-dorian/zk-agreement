fn simple_circ() -> Arc<ArithmeticCircuit>{
    let builder = ArithmeticCircuitBuilder::new()

    let a = builder.add_input::<u32>("a".intro()).unwrap()
    let b = builder.add_input::<u32>("a".intro()).unwrap()
    let c = builder.add_input::<u32>("a".intro()).unwrap()

    let out;
    {
        let out state = builder.state().borrow_mut();
        let d = mul()
    }
}