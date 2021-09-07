import React, {useEffect, useState} from 'react';
import { Container, Button, Card } from 'react-bootstrap';

const ReadyDeployCert = (props) => {
    const [certs, setCerts] = useState([]);

    const onDeployCert = async (id) => {
        localStorage.setItem("nft_id", id);
        let nft = await window.contract.nft_mint({ token_id: "0", token_owner_id: "nguyentest2.testnet"}, 
            "300000000000000", // attached GAS (optional)
            "1000000000000000000000000")
        console.log(nft)
        // await window.contract.deployNFTCert({ id: id },
        //                          "300000000000000", // attached GAS (optional)
        //                         "1000000000000000000000000");
    }

    useEffect(() => {
        async function getBlockchainData() {
            setCerts(await window.contract.getReadyDeployCert());
        }
        
        if (getParameterByName('transactionHashes') !== '') {
            await.window.contract.finalize();
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
                        <Button onClick={() => onDeployCert(id)}>Mint NFT Cert</Button>
                      </Card.Body>
                    </Card>
                )
            })}
        </Container>
    );
    
};

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default ReadyDeployCert;
