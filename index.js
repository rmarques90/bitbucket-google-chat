const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

const webhookPRUrl = process.env.WEBHOOK_PR_URL;
const webhookVersionUrl = process.env.WEBHOOK_VERSION_URL;

if (!webhookPRUrl) {
    console.log("Variavel para URL está vazia...");
    process.exit(1);
}

const types = {
    comment: "Novo comentário",
    created: "PR criado",
    updated: "PR atualizado",
    approved: "PR Aprovado!"
};


app.post('/on-create', async (req, res) => {

    let bitbucketObj = _processBitBucketMsg(req, types.created);
    if (!bitbucketObj) {
        res.status(201).send("O objeto está vazio");
        return;
    }

    try {
        let response = await _postPRDataToGoogle(bitbucketObj);
        res.sendStatus(response.status);
    } catch (e) {
        console.error("Erro enviando dados para o Google", e);
        res.sendStatus(500);
    }
});

app.post('/on-update', async (req, res) => {

    let bitbucketObj = _processBitBucketMsg(req, types.updated);
    if (!bitbucketObj) {
        res.status(201).send("O objeto está vazio");
        return;
    }

    try {
        let response = await _postPRDataToGoogle(bitbucketObj);
        res.sendStatus(response.status);
    } catch (e) {
        console.error("Erro enviando dados para o Google", e);
        res.sendStatus(500);
    }
});

app.post('/on-comment', async (req, res) => {

    let bitbucketObj = _processBitBucketMsg(req, types.comment);
    if (!bitbucketObj) {
        res.status(201).send("O objeto está vazio");
        return;
    }

    try {
        let response = await _postPRDataToGoogle(bitbucketObj);
        res.sendStatus(response.status);
    } catch (e) {
        console.error("Erro enviando dados para o Google", e);
        res.sendStatus(500);
    }
});

app.post('/on-approve', async (req, res) => {

    let bitbucketObj = _processBitBucketMsg(req, types.approved);
    if (!bitbucketObj) {
        res.status(201).send("O objeto está vazio");
        return;
    }

    try {
        let response = await _postPRDataToGoogle(bitbucketObj);
        res.sendStatus(response.status);
    } catch (e) {
        console.error("Erro enviando dados para o Google", e);
        res.sendStatus(500);
    }
});

app.post('/new-version', async (req, res) => {

    let bitbucketObj = _processNewVersionMsg(req, types.approved);
    if (!bitbucketObj) {
        res.status(201).send("O objeto está vazio");
        return;
    }

    try {
        let response = await _postPRDataToGoogle(bitbucketObj, webhookVersionUrl);
        res.sendStatus(response.status);
    } catch (e) {
        console.error("Erro enviando dados para o Google", e);
        res.sendStatus(500);
    }
});

const _postPRDataToGoogle = async (obj, url) => {
    if (!url) {
        url = webhookPRUrl;
    }

    //vamos validar de novo se ainda nao tem url
    if (!url) {
        console.error("URL not defined...");
        return;
    }

    return axios({
        method: 'post',
        url: url,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        },
        data: JSON.stringify(obj)
    });
};

const _processBitBucketMsg = (request, event) => {
    let body = request.body;
    if (!body) {
        console.error("The body is empty");
        return;
    }

    console.log("body received", body);

    if (event !== types.approved) {
        return {
            cards: [
                {
                    header: {
                        title: "Pull Request - Bit Bucket",
                        subtitle: "Avaliação",
                        imageUrl: "https://camo.githubusercontent.com/d31349d067cb58da91664c7b257093ad4f494a70/68747470733a2f2f61746c61737369616e2e67616c6c65727963646e2e76736173736574732e696f2f657874656e73696f6e732f61746c61737369616e2f61746c6173636f64652f312e342e302f313535383132333132313437352f4d6963726f736f66742e56697375616c53747564696f2e53657276696365732e49636f6e732e44656661756c74",
                        imageStyle: "IMAGE"
                    },
                    sections: [
                        {
                            widgets: [
                                {
                                    keyValue: {
                                        topLabel: "PR ID",
                                        content: `${body.pullrequest.id}`,
                                        icon: "STAR"
                                    },
                                },
                                {
                                    keyValue: {
                                        topLabel: "Evento",
                                        content: event,
                                        icon: "BOOKMARK"
                                    }
                                },
                                {
                                    keyValue: {
                                        topLabel: "Autor",
                                        content: body.pullrequest.author.display_name,
                                        icon: "PERSON"
                                    }
                                },
                                {
                                    keyValue: {
                                        topLabel: "Título",
                                        content: body.pullrequest.title,
                                        icon: "DESCRIPTION"
                                    }
                                }
                            ]
                        },
                        {
                            widgets: [
                                {
                                    buttons: [
                                        {
                                            textButton: {
                                                text: "Avaliar Pull Request",
                                                onClick: {
                                                    openLink: {
                                                        url: body.pullrequest.links.html.href
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    } else {
        return {
            cards: [
                {
                    header: {
                        title: "Pull Request - Bit Bucket",
                        subtitle: "Avaliação",
                        imageUrl: "https://camo.githubusercontent.com/d31349d067cb58da91664c7b257093ad4f494a70/68747470733a2f2f61746c61737369616e2e67616c6c65727963646e2e76736173736574732e696f2f657874656e73696f6e732f61746c61737369616e2f61746c6173636f64652f312e342e302f313535383132333132313437352f4d6963726f736f66742e56697375616c53747564696f2e53657276696365732e49636f6e732e44656661756c74",
                        imageStyle: "IMAGE"
                    },
                    sections: [
                        {
                            widgets: [
                                {
                                    keyValue: {
                                        topLabel: "PR ID",
                                        content: `${body.pullrequest.id}`,
                                        icon: "STAR"
                                    },
                                },
                                {
                                    keyValue: {
                                        topLabel: "Evento",
                                        content: types.approved,
                                        icon: "BOOKMARK"
                                    }
                                },
                                {
                                    keyValue: {
                                        topLabel: "Autor",
                                        content: body.pullrequest.author.display_name,
                                        icon: "PERSON"
                                    }
                                },
                                {
                                    keyValue: {
                                        topLabel: "Título",
                                        content: body.pullrequest.title,
                                        icon: "DESCRIPTION"
                                    }
                                }
                            ]
                        },
                        {
                            widgets: [
                                {
                                    keyValue: {
                                        topLabel: "Aprovado por",
                                        content: body.approval.user.display_name,
                                        icon: "FLIGHT_DEPARTURE"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }
};

const _processNewVersionMsg = (request) => {
    let body = request.body;
    if (!body) {
        console.error("The body is empty");
        return;
    }

    // console.log("body received", body);

    let year = `${new Date().getFullYear()}`;
    if (!body.push || !body.push.changes || !body.push.changes.length || !body.push.changes[0].new || !body.push.changes[0].new.type || (body.push.changes[0].new.type.toLowerCase() != 'tag' && (!body.push.changes[0].new.name || body.push.changes[0].new.name.toLowerCase().indexOf(year) <= -1))) {
        console.log("No tag for new version");
        return;
    }

    let version = `${body.push.changes[0].new.name}`;

    console.log("Version updated to: ", version);


    return {
        cards: [
            {
                header: {
                    title: "Nova versão",
                    subtitle: "Autor",
                    imageUrl: "https://camo.githubusercontent.com/d31349d067cb58da91664c7b257093ad4f494a70/68747470733a2f2f61746c61737369616e2e67616c6c65727963646e2e76736173736574732e696f2f657874656e73696f6e732f61746c61737369616e2f61746c6173636f64652f312e342e302f313535383132333132313437352f4d6963726f736f66742e56697375616c53747564696f2e53657276696365732e49636f6e732e44656661756c74",
                    imageStyle: "IMAGE"
                },
                sections: [
                    {
                        widgets: [
                            {
                                keyValue: {
                                    topLabel: "Versão atual",
                                    content: version,
                                    icon: "STAR"
                                },
                            }
                        ]
                    },
                    {
                        widgets: [
                            {
                                buttons: [
                                    {
                                        textButton: {
                                            text: "Abrir site",
                                            onClick: {
                                                openLink: {
                                                    url: 'https://www.meusite.com'
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };
};

app.listen(3000, () => console.log("Listening on port 3000"));
