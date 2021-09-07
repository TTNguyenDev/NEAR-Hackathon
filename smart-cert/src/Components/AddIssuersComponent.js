import React, { useRef, useState } from 'react';
import { Form, Container, Button, Row } from 'react-bootstrap';
import * as nearAPI from 'near-api-js';

const AddIssuersComponent = (props) => {
    const name = useRef();
    const accountId= useRef();
    // const [positive, setPositive] = useState(false);
    
    const submitToBlockchain = async () => {
        // let nft = await window.contract.nft_mint({ token_id: "0", token_owner_id: "nguyentest2.testnet"}, 
        //     "300000000000000", // attached GAS (optional)
        //     "1000000000000000000000000")
        // console.log(nft)
        await window.contract.add_issuer({
            issuer_account: accountId.current.value,
            name: name.current.value,
        });
    }

    return (
        <Container style={{ marginTop: '10px' }}>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>Issuer Name</Form.Label>
                    <Form.Control ref={name} placeholder='Enter Issuer Name'></Form.Control>
                </Form.Group>


                <Form.Group className='mb-3'>
                    <Form.Label>Issuer AccountId</Form.Label>
                    <Form.Control ref={accountId} placeholder='Enter Issuer AccountId'></Form.Control>
                </Form.Group>
               <Row style={{ margin: '5vh' }}>
                    <Button onClick={submitToBlockchain} variant='primary'>Submit</Button>
                </Row>
            </Form>
        </Container>
    );
    
};

export default AddIssuersComponent;
