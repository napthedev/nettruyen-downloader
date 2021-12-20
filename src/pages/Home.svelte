<script>
  import { API_URL } from "../shared/constants";
  import { Button, TextField } from "svelte-materialify";

  export let navigate;

  let inputValue = "";
  const handleFormSubmit = () => {
    navigate(`/${inputValue.split("/").slice(-1)[0]}`);
  };

  const inputRules = [
    (value) =>
      value.startsWith(`${API_URL}/truyen-tranh/`) ||
      value.startsWith(`${API_URL.replace("http", "https")}/truyen-tranh/`) ||
      "Invalid URL",
  ];
</script>

<form on:submit|preventDefault={handleFormSubmit}>
  <img src="/logo.png" alt="" />
  <p class="text-h5">NetTruyen Comic Downloader</p>
  <div>
    <TextField
      style="width: 100vw; max-width: 350px"
      outlined
      autoComplete="off"
      rules={inputRules}
      bind:value={inputValue}>Comic URL</TextField
    >
  </div>
  <Button class="blue white-text" type="submit" size="large"
    >Download the comic</Button
  >
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
</style>
