document.addEventListener("DOMContentLoaded", function () {
  function replaceHref(link, oldText, newText) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      link.href = link.href.replace(oldText, newText);
      window.open(link.href, link.target || "_blank");
    });
  }

  var linkButtons = document.querySelectorAll(".text-link");

  var linkInfo = [
    { type: "email", oldText: "g8d876s5gf", newText: "timohlu98@gmail.com" }
  ];

  linkButtons.forEach(function (linkButton, index) {
    replaceHref(linkButton, linkInfo[index].oldText, linkInfo[index].newText);
  });
});
