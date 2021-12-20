<script>
  import { Router, Route } from "svelte-navigator";
  import Comic from "./pages/Comic.svelte";
  import Home from "./pages/Home.svelte";
</script>

<Router>
  <Route path="/" component={Home} />
  <Route path="/:id" component={Comic} />
  <Route path="/:id/:section" component={Comic} />
</Router>

<style>
  :global(body) {
    margin: 0;
  }
</style>
