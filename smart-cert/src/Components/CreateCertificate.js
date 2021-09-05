import React, { useRef, useState } from 'react';
import { Form, Container, Button, Row } from 'react-bootstrap';

const CreateCertificate = (props) => {
    const accountId = useRef();
    const name = useRef();
    const dob = useRef();
    const national_id = useRef();
    
    const onCreateCert = async () => {
        await window.contract.create_cert({
            user_account_id: accountId.current.value,
            name: name.current.value,
            dob: dob.current.value,
            national_id: national_id.current.value
        });
    }

    return (
        <Container style={{ marginTop: '10px' }}>
            <Form>
                <Form.Group className='mb-3'>
                    <Form.Label>AccountId</Form.Label>
                    <Form.Control ref={accountId} placeholder='Enter accountId'></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control ref={name} placeholder='Enter name'></Form.Control>
                </Form.Group>
                
                <Form.Group className='mb-3'>
                    <Form.Label>User birthday</Form.Label>
                    <Form.Control ref={dob} placeholder='Enter user birthday'></Form.Control>
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Your national id</Form.Label>
                    <Form.Control ref={national_id} placeholder='Enter national id'></Form.Control>
                </Form.Group>

               <Row style={{ margin: '5vh' }}>
                    <Button onClick={onCreateCert} variant='primary'>Submit</Button>
                </Row>
            </Form>
        </Container>
    );
    
};

export default CreateCertificate;
