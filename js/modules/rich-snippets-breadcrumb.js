export default function richSnippetBreadcrumbs() {
  try {
    const mountJSON = () => {
      const jsonLD = [
        {
          "@context": "https://schema.org/",
          "@type": "BreadcrumbList",
          itemListElement: [],
        },
      ];

      $(".mf-breadcrumb .bread-crumb ul li:not(:first-child)").each(function (
        index
      ) {
        if ($(this).find("a").length) {
          const href = $(this).find("a").attr("href").split('?')[0];
          const title =
            $(this).find("a").attr("title") || $(this).find("a > span").text();
          const position = index + 1;

          jsonLD[0].itemListElement.push({
            "@type": "ListItem",
            position: position,
            item: {
              "@id": href,
              name: title,
            },
          });
        }
      });

      const script = document.createElement("script");
      script["type"] = "application/ld+json";
      script.innerHTML = JSON.stringify(jsonLD);
      document.querySelector("head").insertBefore(script, null);
    };

    mountJSON();
  } catch (error) {
    console.error(error, "Não foi possível criar os Rich Snippets");
  }
}
