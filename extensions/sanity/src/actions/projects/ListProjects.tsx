import { ActionPanel, Cache, Icon, List, Action } from "@raycast/api";
import { useEffect, useState } from "react";
import { SanityProject } from "@sanity/client";
import { client } from "../../util/client";
import { resolveStudioURL } from "../../util/resolveStudioURL";
import { ListMembers } from "./members/ListMembers";
import { ListTokens } from "./members/ListTokens";
import { ListDatasets } from "./datasets/ListDatasets";
import { ListCorsOrigins } from "./cors/ListCorsOrigins";
import { AddCorsOrigin } from "./cors/AddCorsOrigin";
//import { ListDatasets } from "./datasets/ListDatasets";
// import { ListCorsOrigins } from "./cors/ListCorsOrigins";
// import { AddCorsOrigin } from "./cors/AddCorsOrigin";
const cache = new Cache();

export function ListProjects() {
  const [projects, setProjects] = useState<SanityProject[] | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      const cachedProjects = cache.get("projects");
      /*
       * If we have a cached version of the projects, use that
       * while we fetch the fresh version in the background
       * */
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects));
      }
      const freshProjects: SanityProject[] = await client.projects.list();
      cache.set("projects", JSON.stringify(freshProjects));
      setProjects(freshProjects);
    }
    fetchProjects();
  }, []);
  const isLoading = !projects;
  return (
    <List searchBarPlaceholder="Search Projects..." isLoading={isLoading}>
      {projects &&
        projects
          .filter((project) => !project.isDisabled && !project.isDisabledByUser)
          .reverse() // Make the new projects show up first
          .map((project) => ({
            ...project,
            studioHost: resolveStudioURL(project.metadata.externalStudioHost || project.studioHost),
          }))
          .map((project) => (
            <List.Item
              key={project.id}
              id={project.id}
              title={project.displayName}
              keywords={project.studioHost ? [project.studioHost] : []}
              actions={
                <ActionPanel>
                  <Action.Push
                    title="Open Project"
                    target={
                      <List>
                        <List.Item
                          title={`Open Studio (${project.studioHost})`}
                          icon={Icon.Link}
                          actions={
                            <ActionPanel>
                              <Action.OpenInBrowser
                                title={`Open Studio (${project.studioHost})`}
                                icon={Icon.Link}
                                url={project.studioHost}
                              />
                            </ActionPanel>
                          }
                        />
                        <List.Item
                          title="Go to Project in sanity.io/manage"
                          icon={Icon.Globe}
                          actions={
                            <ActionPanel>
                              <Action.OpenInBrowser
                                title="Go to Project in sanity.io/manage"
                                url={`https://www.sanity.io/manage/project/${project.id}`}
                              />
                            </ActionPanel>
                          }
                        />
                        <List.Item
                          title="View Project Members"
                          icon={Icon.Person}
                          actions={
                            <ActionPanel>
                              <Action.Push title="Project Members" target={<ListMembers project={project} />} />
                            </ActionPanel>
                          }
                        />
                        <List.Item
                          title="View Project Tokens"
                          icon={Icon.Person}
                          actions={
                            <ActionPanel>
                              <Action.Push title="Project Tokens" target={<ListTokens project={project} />} />
                            </ActionPanel>
                          }
                        />
                        <List.Item
                          title="View Project Datasets"
                          icon={Icon.Coins}
                          actions={
                            <ActionPanel>
                              <Action.Push title="Datasets" target={<ListDatasets project={project} />} />
                            </ActionPanel>
                          }
                        />
                        <List.Item
                          title="View CORS Origins"
                          icon={Icon.Switch}
                          actions={
                            <ActionPanel>
                              <Action.Push title="CORS Origins" target={<ListCorsOrigins project={project} />} />
                              <Action.Push title="Add CORS Origin" target={<AddCorsOrigin project={project} />} />
                            </ActionPanel>
                          }
                        />
                      </List>
                    }
                  />
                  <Action.CopyToClipboard
                    title={`Copy Project ID (${project.id})`}
                    icon={Icon.Link}
                    content={project.id}
                  />
                </ActionPanel>
              }
              accessories={[
                {
                  text: project.studioHost || "⚠️ Missing Studio URL",
                },
              ]}
            />
          ))}
    </List>
  );
}
