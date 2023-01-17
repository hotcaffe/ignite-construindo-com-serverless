import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";
import {v4} from 'uuid'

interface EventBody {
    title: string,
    deadline: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
    const {userid} = event.pathParameters;
    const {title, deadline} = JSON.parse(event.body) as EventBody;

    try {
        await document.put({
            TableName: "todo_list",
            Item: {
                id: v4(),
                user_id: userid,
                title,
                done: false,
                deadline
            }
        }).promise();
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Erro interno ao criar TODO!"
            })
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "TODO criado com sucesso!"
        })
    }
}