# bitbucket-google-chat
Integrator to get webhook from bitbucket and send to Google Chat Webhook.

Aplicação para receber os webhooks do BitBucket e enviar para seu Bot Webhook no Google Chat.

Primeiro, criar um Webhook Bot em uma sala no Google Chat: https://developers.google.com/hangouts/chat/how-tos/webhooks

O próximo passo deve ser realizado nas configurações do seu repositório no BitBucket. Aba webhooks e configurar cada trigger para um endpoint específico.

Para subir a aplicação utilizar a variável de ambiente `WEBHOOK_PR_URL` com o endereço URL do Bot criado.

A aplicação pode ser executada via docker ou via NodeJS. Versão NODE recomendada: 11. Caso execute via NodeJS, lembrar de executar o cmd `npm install`.

## Endpoints disponíveis:

* /on-create - Endpoint para receber a notificação da criação de Pull Requests
* /on-update - Endpoint para receber a notificação de uma atualização de Pull Request
* /on-comment - Endpoint para receber a notificação de um novo comentário em um Pull Request
* /on-approve - Endpoint para receber a notificação da aprovação de um Pull Request
