<script>
  import { API_URL } from "../shared/constants";

  export let navigate;

  let inputValue = "";
  const handleFormSubmit = () => {
    if (validateInput(inputValue)) {
      navigate(`/${inputValue.split("/").slice(-1)[0]}`);
    }
  };

  const validateInput = (value) =>
    value.startsWith(`${API_URL}/truyen-tranh/`) ||
    value.startsWith(`${API_URL.replace("http", "https")}/truyen-tranh/`);
</script>

<form on:submit|preventDefault={handleFormSubmit}>
  <img src="/logo.png" alt="" />
  <p class="text-h5">NetTruyen Comic Downloader</p>
  <div>
    <input
      bind:value={inputValue}
      type="text"
      class="input-outline"
      placeholder="Comic URL"
    />
  </div>
  <button type="submit" class="btn-primary btn-lg">Download the comic</button>
</form>

<style>
  form {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  img {
    width: 100px;
    height: 100px;
  }

  p {
    margin: 0;
  }

  input {
    width: 100vw;
    max-width: 350px;
    height: 50px;
    padding: 0 15px;
  }
</style>
