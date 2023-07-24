export function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return; // Si aucun fichier n'est sélectionné, ne rien faire

  const formData = new FormData();
  formData.append("file", file);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        const oPanelMessage = document.getElementById("panel_message");
        const oMessageSuccess = document.getElementById("message_success");
        oMessageSuccess.innerText = "Téléversement du fichier réussi !";
        oMessageSuccess.classList.remove("hidden");
        oPanelMessage.classList.remove("hidden");
      } else {
        const oMessageError = document.getElementById("message_error");
        oMessageError.innerText = "Échec du téléversement du fichier.";
        oMessageError.classList.remove("hidden");
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors du téléversement du fichier :",
        error
      );
    });
}
