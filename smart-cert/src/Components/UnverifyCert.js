import React, {useEffect, useState} from 'react';
import { Container, Button, Card } from 'react-bootstrap';

const UnverifyCert = (props) => {
    const [certs, setCerts] = useState([]);

    const onApproveCert = async (id) => {
        await window.contract.user_approved({ id: id });
    }

    useEffect(() => {
        async function getBlockchainData() {
            setCerts(await window.contract.getUnApprovedCert());
        }
        getBlockchainData();
    }, []);

    return (
        <Container>

            <p>&nbsp;</p>
            {certs.map((v,k) => {
                let [id, cert] = v;

                console.log(v);
                return (
                    <Card style={{ width: '18rem' }}>
                      <Card.Body>
                        <Card.Title>{cert.user_info.name}'s Certificate</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Issued by {cert.user_info.from.name}</Card.Subtitle>
                        <Card.Text>
                            Name: {cert.user_info.name}
                        </Card.Text>
                        <Card.Text>
                            Dob: {cert.user_info.dob}
                        </Card.Text>
                        <Card.Text>
                            National Id: {cert.user_info.national_id}
                        </Card.Text>
                        <Card.Text>
                            Issuer Id: {cert.user_info.from.issuer_id}
                        </Card.Text>
                        <Button onClick={() => onApproveCert(id)}>Approve this Cert</Button>
                      </Card.Body>
                    </Card>
                )
            })}
        </Container>
    );
    
};

export default UnverifyCert;
