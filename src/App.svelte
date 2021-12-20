<script>
  import { Router, Route } from "svelte-navigator";
  import Comic from "./pages/Comic.svelte";
  import Home from "./pages/Home.svelte";
</script>

<Router>
  <Route primary={false} path="/" component={Home} />
  <Route primary={false} path="/:id" component={Comic} />
  <Route primary={false} path="/:id/:section" component={Comic} />
</Router>

<style>
  :global(body) {
    margin: 0;
  }
</style>
