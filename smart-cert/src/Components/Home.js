import React, {useEffect, useState, useRef} from 'react';
import { 
    Container,
    Row,
    Col,
    Card,
    Button,
    Form
} from 'react-bootstrap';

const Home = (props) => {

    const [cert, setCert] = useState(null);

    const certHash = useRef();

    // useEffect(() => {
    //     async function getDeclarationData() {

    //         setPositiveNumber(await window.contract.getPositiveNumber());
    //         setNegativeNumber(await window.contract.getNegativeNumber());
    //         setTotalDeclaration(await window.contract.getTotalDeclaration());
    //         await window.contract.getListDeclaration();
    //     }
    //     getDeclarationData();
    // }, []);

    const getMetaData = async () => {
        setCert(await window.contract.get_cert_info({txid: certHash.current.value}));
    }

    return (
            <Container>
                <h1>Check Your Cert</h1>

                <Form>
                    <Form.Group className='mb-3'>
                        <Form.Label>Hash:</Form.Label>
                        <Form.Control ref={certHash} placeholder='Enter cert hash'></Form.Control>
                    </Form.Group>
                </Form>
                <Button onClick={() => getMetaData()} style={{width: '100%'}}>Check</Button>

        {cert !== null ? 
        <>
            <h1>Cert Info</h1>
            <h4>Title: {cert.title}</h4>
            <h4>Description: {cert.description}</h4>
            <a href={"https://explorer.testnet.near.org/transactions/" + certHash.current.value}>View on BlockExplorer</a>
        </>
        :
        <></>
        }

            </Container>
    );
};

export default Home;
