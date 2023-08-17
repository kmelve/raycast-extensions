import { token, tokenError } from "./util/client";
import { ListProjects } from "./actions/projects/ListProjects";

export default function SanityExtension() {
  if (!token) {
    return tokenError();
  }
  return <ListProjects />;
  {
    /* TODO: Add project creation */
    /* <List>
      <List.Item
        icon="list-icon.png"
        title="Your Projects"
        actions={
          <ActionPanel>
            <Action.Push title="Browse Projects" target={<ListProjects />} />
          </ActionPanel>
        }
      />
      <List.Item
        icon="list-icon.png"
        title="Create a New Sanity Studio"
        actions={
          <ActionPanel>
            <Action title="Create a New Studio" onAction={() => null} />
          </ActionPanel>
        }
      />
    </List> */
  }
}
