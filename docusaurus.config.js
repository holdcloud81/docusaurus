// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// CI 환경 여부 확인 (GitHub Actions에서 실행 중인지 판단)
const isCI = process.env.GITHUB_ACTIONS === 'true';

/** @type {import('@docusaurus/types').Config} */
const config = {
  // 사이트 기본 정보
  title: 'holdcloud',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',

  // GitHub Pages 배포 설정
  url: 'https://holdcloud.github.io',
  baseUrl: '/docusaurus-public/',
  organizationName: 'holdcloud',
  projectName: 'docusaurus-public',
  trailingSlash: false,

  // 링크 오류 처리 설정
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // 언어 설정
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  // 프리셋 구성: docs, blog 비활성화
  presets: [
    [
      'classic',
      ({
        docs: false,
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  plugins: [
    // 공개 문서 (docs/ 경로 사용)
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'public',
        path: 'docs',
        routeBasePath: 'docs',
        sidebarPath: require.resolve('./sidebars/sidebars.js'),
      },
    ],
    // 비공개 문서 플러그인은 CI 환경에서는 제외한다.
    ...(!isCI ? [
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'private',
          path: 'private-docs',
          routeBasePath: 'private-docs',
          sidebarPath: require.resolve('./sidebars/sidebars-private.js'),
        },
      ]
    ] : []),

    // 로컬 검색 플러그인 설정 외부에서는 제외한다.
    [
      require.resolve("docusaurus-lunr-search"),
      {
        languages: ["en", "ko"], // 지원 언어 설정
        includeRoutes: ["/docs","/private-docs"], // 검색할 경로
        highlightResult: true, // 검색 결과 강조
        fields: {
          title: { boost: 200 },
          content: { boost: 100 },
          keywords: { boost: 50 }
        },
      },
    ],
  ],

  // 테마 구성
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'My Site',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        // 공개 문서 사이드바
        {
          type: 'docSidebar',
          sidebarId: 'publicSidebar',
          position: 'left',
          docsPluginId: 'public',
          label: 'public',
        },
        // 비공개 문서 사이드바는 CI에서는 제외
        ...(!isCI ? [
          {
            type: 'docSidebar',
            sidebarId: 'privateSidebar',
            position: 'left',
            docsPluginId: 'private',
            label: 'private',
          }
        ] : []),
        {
          href: 'https://github.com/facebook/docusaurus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'public',
              to: 'docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'X',
              href: 'https://x.com/docusaurus',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/docusaurus',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
