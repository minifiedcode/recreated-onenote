import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../helpers/graph_client";
import errors from "../../../helpers/errors";
import { ApiFetchOptions } from "../../../helpers/graph_client";
import validateToken from "../../../helpers/validate_token";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") return res.status(200).json(errors.invalid_request);
  req.cookies = JSON.parse(req.headers.cookie || "");
  const token = validateToken(req);
  const body = JSON.parse(req.body);
  if (typeof token !== "string") return res.status(400).json(token);
  if (body === undefined) return res.status(400).json(errors.invalid_entry);

  try {
    const notebook = await client.api(
      `onenote/notebooks?$filter=displayName eq '${body.displayName}'`,
      token
    );

    if (notebook.value.length > 0)
      return res.status(200).json(notebook.value[0]); // Returns the current notebook if one exists
    const createNotebook = await fetch(
      "http://localhost:3000/api/create/notebook",
      {
        method: "POST",
        headers: {
          Cookie: JSON.stringify(req.cookies),
        },
        body: JSON.stringify(body),
      }
    );
    const json = await createNotebook.json();

    res.status(200).json(json);
  } catch (err) {
    console.log(err);
    return res.status(400).json(errors.invalid_request);
  }
}
