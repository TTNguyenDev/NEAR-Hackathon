import React, {useEffect, useState} from 'react';
import { Container, Button, Card } from 'react-bootstrap';

const ReadyDeployCert = (props) => {
    const [certs, setCerts] = useState([]);

    const onDeployCert = async (id) => {
        localStorage.setItem("nft_id", id);
        await window.contract.deployNFTCert({ id: id });
    }

    useEffect(() => {
        async function getBlockchainData() {
            setCerts(await window.contract.getReadyDeployCert());
        }
        getBlockchainData();
    }, []);

    return (
        <Container>
            {certs.map((k, v) => {
                let [id, cert] = v;
                return (
                    <Card style={{ width: '18rem' }}>
                      <Card.Body>
                        <Card.Title>Certificate of {cert.user_info.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Issued by {cert.user_info.from.name}</Card.Subtitle>
                        <Card.Text>
                            Some description of cert
                        </Card.Text>
                        <Button onClick={() => onDeployCert(id)}>Deploy this cert</Button>
                          {/* <Card.Link href="#">Card Link</Card.Link> */}
                        {/* <Card.Link href="#">Another Link</Card.Link> */}
                      </Card.Body>
                    </Card>
                );
            })}
        </Container>
    );
    
};

export default ReadyDeployCert;
