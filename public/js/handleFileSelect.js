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
        alert("Fichier téléversé avec succès !");
      } else {
        alert("Échec du téléversement du fichier.");
      }
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors du téléversement du fichier :",
        error
      );
    });
}
