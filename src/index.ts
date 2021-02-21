import { Feed } from "feed";
import dayjs from "dayjs";
import { SEARCH_ITEMS } from "./rss";
import * as fs from "fs/promises";
import path from "path";
import { graphql } from "@octokit/graphql";
import { Issue, PullRequest, Repository, SearchResultItemConnection, SearchType } from "@octokit/graphql-schema";
import { convertJsonToOPML } from "./toOPML";

function escapeSpecialChars(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

type Item = {
    url: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    author: {
        avatarUrl: string;
        login: string;
        url: string;
    };
    bodyHTML: string;
};
export const search = ({
    query,
    TYPE,
    GITHUB_TOKEN
}: {
    query: string;
    TYPE: SearchType;
    GITHUB_TOKEN: string;
}): Promise<Item[]> => {
    return graphql<{ search: SearchResultItemConnection }>(
        `
            query($QUERY: String!, $TYPE: SearchType!) {
                search(query: $QUERY, type: $TYPE, first: 20) {
                    edges {
                        node {
                            __typename
                            ... on Repository {
                                url
                                title: name
                                createdAt
                                updatedAt
                                owner {
                                    avatarUrl
                                    login
                                    url
                                }
                                descriptionHTML
                            }
                            ... on PullRequest {
                                url
                                title
                                createdAt
                                updatedAt
                                author {
                                    avatarUrl
                                    login
                                    url
                                }
                                bodyHTML
                            }
                            ... on Issue {
                                url
                                title
                                createdAt
                                updatedAt
                                author {
                                    avatarUrl
                                    login
                                    url
                                }
                                bodyHTML
                            }
                        }
                    }
                }
            }
        `,
        {
            QUERY: query,
            TYPE,
            headers: {
                authorization: `token ${GITHUB_TOKEN}`
            }
        }
    ).then((res) => {
        const edges = res.search.edges ?? [];
        return edges?.map((edge) => {
            const node = edge?.node as Issue | PullRequest | Repository;
            const isIssue = (node: any): node is Issue | PullRequest => {
                return node.__typename === "Issue" || node.__typename === "PullRequest";
            };
            if (isIssue(node)) {
                return node as Item;
            } else {
                return {
                    url: node.url,
                    title: node.name,
                    createdAt: node.createdAt,
                    updatedAt: node.updatedAt,
                    author: {
                        avatarUrl: node.owner?.avatarUrl,
                        login: node.owner?.login,
                        url: node.owner?.url
                    },
                    bodyHTML: node.descriptionHTML
                } as Item;
            }
        });
    });
};

export type GenerateRSSOptions = {
    title: string;
    description: string;
    link: string;
    image?: string;
    favicon?: string;
    updated: Date;
    filter?: (item: Item) => boolean; // if return true, it is included in the result
};

export const generateRSS = (items: Item[], options: GenerateRSSOptions) => {
    const feed = new Feed({
        title: options.title,
        description: options.description,
        id: options.link,
        link: options.link,
        image: options.image,
        favicon: options.favicon,
        copyright: "github-search-rss",
        updated: options.updated,
        generator: "github-search-rss"
    });
    const filter = options.filter;
    const filteredItems = filter ? items.filter((item) => filter(item)) : items;
    filteredItems.forEach((item) => {
        const description = item.bodyHTML ?? "";
        const image = item.author.avatarUrl
            ? `<img src="${item.author.avatarUrl}" width="64" height="64" alt=""/><br/>`
            : "";
        feed.addItem({
            title: item.title,
            content: image + description,
            link: item.url,
            author: [
                {
                    name: item.author.login,
                    link: item.author.url,
                    email: `${item.author.login}@noreply.github.com`
                }
            ],
            date: dayjs(item.createdAt).toDate()
        });
    });
    if (path.extname(options.link) === ".json") {
        return feed.json1();
    } else {
        return feed.atom1();
    }
};

export type RSSItem = {
    query: string;
    TYPE: SearchType;
} & Omit<GenerateRSSOptions, "updated" | "description">;
if (require.main === module) {
    const distDir = path.join(__dirname, "../dist");
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    if (!GITHUB_TOKEN) {
        throw new Error("env.GITHUB_TOKEN required");
    }
    (async function () {
        await fs.mkdir(distDir, {
            recursive: true
        });
        for (const item of SEARCH_ITEMS) {
            const { query, TYPE, ...options } = item;
            const items = await search({
                query,
                TYPE,
                GITHUB_TOKEN: GITHUB_TOKEN
            });
            if (!items) {
                throw new Error("Can not search:" + query);
            }
            const rss = generateRSS(items, {
                ...options,
                description: `${item.title} on GitHub`,
                updated: new Date()
            });
            const fileName = path.basename(item.link);
            await fs.writeFile(path.join(distDir, fileName), rss, "utf-8");
        }
        const opml = convertJsonToOPML(SEARCH_ITEMS);
        await fs.writeFile(path.join(distDir, "index.opml"), opml, "utf-8");
        const links = SEARCH_ITEMS.map((feed) => {
            return `<li><code>${escapeSpecialChars(feed.query)}</code>: <a href="${feed.link}">${feed.link}</a></li>`;
        }).join("\n");
        const index = {
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>github-search-rss</title>
</head>
<body>
<p>These RSS Feed is search result of GitHub. Your RSS reader need to support JSON RSS.</p>
<p><a href="./index.opml">OPML Feeds</a></p>
<ul>
${links}
</ul>
<footer>
<a href="https://github.com/azu/github-search-rss">Source Code</a>
</footer>
</body>
</html>
`
        };
        await fs.writeFile(path.join(distDir, "index.html"), index.html, "utf-8");
    })().catch((error) => {
        console.error(error);
        process.exit(1);
    });
}
