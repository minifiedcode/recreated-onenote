import { NextApiRequest, NextApiResponse } from "next";
import errors from "../../../helpers/errors";
import { ApiFetchOptions, client } from "../../../helpers/graph_client";
import validateToken from "../../../helpers/validate_token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = validateToken(req);
  const body = JSON.parse(req.body || "");
  if (typeof token !== "string")
    return res.status(400).json(errors.invalid_token);
  if (!body) return res.status(400).json(errors.invalid_entry);

  const options: ApiFetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const section = await client.api(
    `onenote/notebooks/${body.notebookID}/sections`,
    token,
    options,
    JSON.stringify(body)
  );

  res.status(200).json(section);
}