const form = $("#form");
const fileList = $("#files");

$.get("/directoryInformation").then((data) => {
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    fileList.append(`<a href="/uploaded/${data[i]}">${data[i]}</a><br />`);
  }
});

form.on("submit", (e) => {
  e.preventDefault();

  var formData = new FormData();
  formData.append("file", $("#fileInput")[0].files[0]);
  console.log(formData);

  $.ajax({
    url: "/",
    type: "POST",
    data: formData,
    processData: false,
    contentType: false,
    success: function (response) {
      console.log(response);
      fileList.append(`<a href="/uploaded/${response}">${response}</a><br />`);
    },
  });
});
