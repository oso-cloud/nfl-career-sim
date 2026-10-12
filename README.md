# NFL Career Sim

A free browser game. Pick a name and a position (QB, RB, WR or TE), then choose from three random offers from the top 50 college programs. Sim your college seasons, declare for the draft, and land on an NFL team. From there it's your call: re-sign, chase a ring in free agency, request a trade, or retire. When you hang it up, you get a shareable career card with your draft slot, earnings, rings, awards and career stats.

**Play:** https://nfl-career-sim.vercel.app

## How the project is laid out

```
index.html     ← the whole game: layout, styles, engine and data in one file
tools/
  sim.js       ← plays hundreds of careers instantly and prints the odds
vercel.json    ← tells Vercel to serve the folder as-is (no build step)
```

## Making a change

1. Edit `index.html`.
2. Open it in a browser to try it.
3. Commit and push to `main`. Every push auto-deploys to the live site.

If a deploy breaks something, go to the Vercel project → **Deployments**, then **Promote to Production** on the last good one.

## Checking the balance

After any odds change, run the simulator (needs Node.js):

```
node tools/sim.js 1000
```

It prints, per position: first-round rate, median pick, undrafted rate, average seasons and earnings, rings/MVPs/All-Pros per career, and the share of careers per Hall of Fame verdict. It always signs the first offer and never retires early, so real players will see shorter careers.

## Where the main knobs are in `index.html`

Search the script for these names:

| What | Where to look |
|---|---|
| The 50 colleges, conference and prestige | `COLLEGES` |
| Position salary caps, decline age, jersey numbers | `POS` |
| Stat lines per season | `genStats` |
| When you start in college | `collegeThreshold`, `simCollegeSeason` |
| College awards (All-Conference, All-American, Heisman) | the `aw.push` lines in `simCollegeSeason` |
| Draft position | `draftScore`, `pickFromScore` |
| NFL role, injuries, wins, playoffs | `simNflSeason` |
| Pro Bowl, All-Pro, MVP, OPOY, ROY odds | the `aw.push` lines in `simNflSeason` |
| Aging and development | `offseason` |
| Contracts and free agency offers | `marketValue`, `offerYears`, `genOffers` |
| Getting released, extensions | the end of `offseason` |
| Hall of Fame verdict thresholds | `hof` |

## Share links

The career card is stored in the link itself (after the `#`), so share links work without a server or database. On the live site, links point back to that site.
