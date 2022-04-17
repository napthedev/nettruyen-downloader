<script>
  import { Router, Route } from "svelte-navigator";
  import Comic from "./pages/Comic.svelte";
  import Home from "./pages/Home.svelte";
  import { CONVERSION_API } from "./shared/constants";

  fetch(CONVERSION_API);
</script>

<Router>
  <Route primary={false} path="/" component={Home} />
  <Route path="/:id" component={Comic} />
  <Route path="/:id/:section" component={Comic} />
</Router>
