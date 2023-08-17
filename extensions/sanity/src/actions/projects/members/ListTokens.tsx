import { useEffect, useState } from "react";
import { List, Cache } from "@raycast/api";

import { projectClient } from "../../../util/client";
import { SanityExtendedUser } from "../../../types/Member";
import { SanityProject } from "@sanity/client";

const cache = new Cache();
export function ListTokens(props: { project: SanityProject }) {
  const { project } = props;
  const membersList = project.members.map(({ id }: { id: string }) => id).join(",");
  const cacheKey = `${project.id}-membersList`;
  const [tokens, setTokens] = useState<SanityExtendedUser[] | null>(null);
  useEffect(() => {
    async function fetchTokens() {
      const cachedTokens = cache.get(cacheKey);
      if (cachedTokens) {
        setTokens(JSON.parse(cachedTokens));
      }
      const result: SanityExtendedUser[] = await projectClient(project.id)
        .request({ url: `/users/${membersList}` })
        .catch((err) => console.log(err));
      const members = Array.isArray(result) ? result : [result]; // endpoint returns object if just one member
      const freshTokens = members.filter((member) => member.provider === "sanity-token");

      cache.set(cacheKey, JSON.stringify(freshTokens));
      setTokens(freshTokens);
    }
    fetchTokens();
  }, []);

  return (
    <List filtering={true} isLoading={!tokens}>
      {tokens &&
        tokens
          /* Filter out the token users */
          .map((token) => {
            return <List.Item key={token.id} title={token.displayName}></List.Item>;
          })}
    </List>
  );
}
