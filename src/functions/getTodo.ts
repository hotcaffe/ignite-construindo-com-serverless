import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

async function checkExistsTODO(user_id: string) {
  try {
    const query = await document
      .query({
        TableName: "todo_list",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": user_id,
        },
      }).promise();

    return query;
  } catch (err) {
    throw new Error("Erro interno ao consultar TODOs do usuário!");
  }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const todo = await checkExistsTODO(event.pathParameters.userid);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: todo,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};
