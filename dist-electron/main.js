import { app as L, ipcMain as _, BrowserWindow as te } from "electron";
import y from "path";
import { fileURLToPath as oe } from "url";
import I from "fs";
import se from "events";
import ce from "util";
import N from "crypto";
function ne(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var P = { exports: {} };
function ue(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var M = { exports: {} }, D, X;
function de() {
  if (X) return D;
  X = 1;
  var e = y.sep || "/";
  D = t;
  function t(n) {
    if (typeof n != "string" || n.length <= 7 || n.substring(0, 7) != "file://")
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    var i = decodeURI(n.substring(7)), o = i.indexOf("/"), s = i.substring(0, o), a = i.substring(o + 1);
    return s == "localhost" && (s = ""), s && (s = e + e + s), a = a.replace(/^(.+)\|/, "$1:"), e == "\\" && (a = a.replace(/\//g, "\\")), /^.+\:/.test(a) || (a = e + a), s + a;
  }
  return D;
}
var B;
function le() {
  return B || (B = 1, (function(e, t) {
    var n = I, i = y, o = de(), s = i.join, a = i.dirname, c = n.accessSync && function(d) {
      try {
        n.accessSync(d);
      } catch {
        return !1;
      }
      return !0;
    } || n.existsSync || i.existsSync, l = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function m(d) {
      typeof d == "string" ? d = { bindings: d } : d || (d = {}), Object.keys(l).map(function(h) {
        h in d || (d[h] = l[h]);
      }), d.module_root || (d.module_root = t.getRoot(t.getFileName())), i.extname(d.bindings) != ".node" && (d.bindings += ".node");
      for (var E = typeof __webpack_require__ == "function" ? __non_webpack_require__ : ue, r = [], u = 0, T = d.try.length, p, g, R; u < T; u++) {
        p = s.apply(
          null,
          d.try[u].map(function(h) {
            return d[h] || h;
          })
        ), r.push(p);
        try {
          return g = d.path ? E.resolve(p) : E(p), d.path || (g.path = p), g;
        } catch (h) {
          if (h.code !== "MODULE_NOT_FOUND" && h.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(h.message))
            throw h;
        }
      }
      throw R = new Error(
        `Could not locate the bindings file. Tried:
` + r.map(function(h) {
          return d.arrow + h;
        }).join(`
`)
      ), R.tries = r, R;
    }
    e.exports = t = m, t.getFileName = function(E) {
      var r = Error.prepareStackTrace, u = Error.stackTraceLimit, T = {}, p;
      Error.stackTraceLimit = 10, Error.prepareStackTrace = function(R, h) {
        for (var S = 0, w = h.length; S < w; S++)
          if (p = h[S].getFileName(), p !== __filename)
            if (E) {
              if (p !== E)
                return;
            } else
              return;
      }, Error.captureStackTrace(T), T.stack, Error.prepareStackTrace = r, Error.stackTraceLimit = u;
      var g = "file://";
      return p.indexOf(g) === 0 && (p = o(p)), p;
    }, t.getRoot = function(E) {
      for (var r = a(E), u; ; ) {
        if (r === "." && (r = process.cwd()), c(s(r, "package.json")) || c(s(r, "node_modules")))
          return r;
        if (u === r)
          throw new Error(
            'Could not find module root given file: "' + E + '". Do you have a `package.json` file? '
          );
        u = r, r = s(r, "..");
      }
    };
  })(M, M.exports)), M.exports;
}
var F, $;
function Ee() {
  return $ || ($ = 1, F = le()("node_sqlite3.node")), F;
}
var k = {}, Y;
function me() {
  if (Y) return k;
  Y = 1;
  const e = ce;
  function t(i, o, s) {
    const a = i[o];
    i[o] = function() {
      const c = new Error(), l = i.constructor.name + "#" + o + "(" + Array.prototype.slice.call(arguments).map(function(d) {
        return e.inspect(d, !1, 0);
      }).join(", ") + ")";
      typeof s > "u" && (s = -1), s < 0 && (s += arguments.length);
      const m = arguments[s];
      return typeof arguments[s] == "function" && (arguments[s] = function() {
        const E = arguments[0];
        return E && E.stack && !E.__augmented && (E.stack = n(E).join(`
`), E.stack += `
--> in ` + l, E.stack += `
` + n(c).slice(1).join(`
`), E.__augmented = !0), m.apply(this, arguments);
      }), a.apply(this, arguments);
    };
  }
  k.extendTrace = t;
  function n(i) {
    return i.stack.split(`
`).filter(function(o) {
      return o.indexOf(__filename) < 0;
    });
  }
  return k;
}
var K;
function pe() {
  return K || (K = 1, (function(e, t) {
    const n = y, i = Ee(), o = se.EventEmitter;
    e.exports = i;
    function s(r) {
      return function(u) {
        let T;
        const p = Array.prototype.slice.call(arguments, 1);
        if (typeof p[p.length - 1] == "function") {
          const R = p[p.length - 1];
          T = function(h) {
            h && R(h);
          };
        }
        const g = new l(this, u, T);
        return r.call(this, g, p);
      };
    }
    function a(r, u) {
      for (const T in u.prototype)
        r.prototype[T] = u.prototype[T];
    }
    i.cached = {
      Database: function(r, u, T) {
        if (r === "" || r === ":memory:")
          return new c(r, u, T);
        let p;
        if (r = n.resolve(r), !i.cached.objects[r])
          p = i.cached.objects[r] = new c(r, u, T);
        else {
          p = i.cached.objects[r];
          const g = typeof u == "number" ? T : u;
          if (typeof g == "function") {
            let R = function() {
              g.call(p, null);
            };
            p.open ? process.nextTick(R) : p.once("open", R);
          }
        }
        return p;
      },
      objects: {}
    };
    const c = i.Database, l = i.Statement, m = i.Backup;
    a(c, o), a(l, o), a(m, o), c.prototype.prepare = s(function(r, u) {
      return u.length ? r.bind.apply(r, u) : r;
    }), c.prototype.run = s(function(r, u) {
      return r.run.apply(r, u).finalize(), this;
    }), c.prototype.get = s(function(r, u) {
      return r.get.apply(r, u).finalize(), this;
    }), c.prototype.all = s(function(r, u) {
      return r.all.apply(r, u).finalize(), this;
    }), c.prototype.each = s(function(r, u) {
      return r.each.apply(r, u).finalize(), this;
    }), c.prototype.map = s(function(r, u) {
      return r.map.apply(r, u).finalize(), this;
    }), c.prototype.backup = function() {
      let r;
      return arguments.length <= 2 ? r = new m(this, arguments[0], "main", "main", !0, arguments[1]) : r = new m(this, arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), r.retryErrors = [i.BUSY, i.LOCKED], r;
    }, l.prototype.map = function() {
      const r = Array.prototype.slice.call(arguments), u = r.pop();
      return r.push(function(T, p) {
        if (T) return u(T);
        const g = {};
        if (p.length) {
          const R = Object.keys(p[0]), h = R[0];
          if (R.length > 2)
            for (let S = 0; S < p.length; S++)
              g[p[S][h]] = p[S];
          else {
            const S = R[1];
            for (let w = 0; w < p.length; w++)
              g[p[w][h]] = p[w][S];
          }
        }
        u(T, g);
      }), this.all.apply(this, r);
    };
    let d = !1;
    const E = ["trace", "profile", "change"];
    c.prototype.addListener = c.prototype.on = function(r) {
      const u = o.prototype.addListener.apply(this, arguments);
      return E.indexOf(r) >= 0 && this.configure(r, !0), u;
    }, c.prototype.removeListener = function(r) {
      const u = o.prototype.removeListener.apply(this, arguments);
      return E.indexOf(r) >= 0 && !this._events[r] && this.configure(r, !1), u;
    }, c.prototype.removeAllListeners = function(r) {
      const u = o.prototype.removeAllListeners.apply(this, arguments);
      return E.indexOf(r) >= 0 && this.configure(r, !1), u;
    }, i.verbose = function() {
      if (!d) {
        const r = me();
        [
          "prepare",
          "get",
          "run",
          "all",
          "each",
          "map",
          "close",
          "exec"
        ].forEach(function(u) {
          r.extendTrace(c.prototype, u);
        }), [
          "bind",
          "get",
          "run",
          "all",
          "each",
          "map",
          "reset",
          "finalize"
        ].forEach(function(u) {
          r.extendTrace(l.prototype, u);
        }), d = !0;
      }
      return i;
    };
  })(P)), P.exports;
}
var fe = pe();
const _e = /* @__PURE__ */ ne(fe);
var A = {}, C = {}, G;
function ie() {
  if (G) return C;
  G = 1, Object.defineProperty(C, "__esModule", { value: !0 }), C.formatError = void 0;
  function e(t) {
    if (t instanceof Error)
      return t;
    if (typeof t == "object") {
      const n = new Error();
      for (let i in t)
        n[i] = t[i];
      return t.message && (n.message = t.message), n;
    }
    return typeof t == "string" ? new Error(t) : new Error(t);
  }
  return C.formatError = e, C;
}
var z;
function re() {
  if (z) return A;
  z = 1, Object.defineProperty(A, "__esModule", { value: !0 }), A.Statement = void 0;
  const e = ie();
  let t = class {
    constructor(i) {
      this.stmt = i;
    }
    /**
     * Returns the underlying sqlite3 Statement instance
     */
    getStatementInstance() {
      return this.stmt;
    }
    /**
     * Binds parameters to the prepared statement.
     *
     * Binding parameters with this function completely resets the statement object and row cursor
     * and removes all previously bound parameters, if any.
     */
    bind(...i) {
      return new Promise((o, s) => {
        this.stmt.bind(...i, (a) => {
          if (a)
            return s((0, e.formatError)(a));
          o();
        });
      });
    }
    /**
     * Resets the row cursor of the statement and preserves the parameter bindings.
     * Use this function to re-execute the same query with the same bindings.
     */
    reset() {
      return new Promise((i) => {
        this.stmt.reset(() => {
          i();
        });
      });
    }
    /**
     * Finalizes the statement. This is typically optional, but if you experience long delays before
     * the next query is executed, explicitly finalizing your statement might be necessary.
     * This might be the case when you run an exclusive query (see section Control Flow).
     * After the statement is finalized, all further function calls on that statement object
     * will throw errors.
     */
    finalize() {
      return new Promise((i, o) => {
        this.stmt.finalize((s) => {
          if (s)
            return o((0, e.formatError)(s));
          i();
        });
      });
    }
    /**
     * Binds parameters and executes the statement.
     *
     * If you specify bind parameters, they will be bound to the statement before it is executed.
     * Note that the bindings and the row cursor are reset when you specify even a single bind parameter.
     *
     * The execution behavior is identical to the Database#run method with the difference that the
     * statement will not be finalized after it is run. This means you can run it multiple times.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     */
    run(...i) {
      return new Promise((o, s) => {
        const a = this;
        this.stmt.run(...i, function(c) {
          if (c)
            return s((0, e.formatError)(c));
          o({
            stmt: a,
            lastID: this.lastID,
            changes: this.changes
          });
        });
      });
    }
    /**
     * Binds parameters, executes the statement and retrieves the first result row.
     * The parameters are the same as the Statement#run function, with the following differences:
     *
     * Using this method can leave the database locked, as the database awaits further
     * calls to Statement#get to retrieve subsequent rows. To inform the database that you
     * are finished retrieving rows, you should either finalize (with Statement#finalize)
     * or reset (with Statement#reset) the statement.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     */
    get(...i) {
      return new Promise((o, s) => {
        this.stmt.get(...i, (a, c) => {
          if (a)
            return s((0, e.formatError)(a));
          o(c);
        });
      });
    }
    /**
     * Binds parameters, executes the statement and calls the callback with all result rows.
     * The parameters are the same as the Statement#run function, with the following differences:
     *
     * If the result set is empty, it will resolve to an empty array, otherwise it contains an
     * object for each result row which in turn contains the values of that row.
     * Like with Statement#run, the statement will not be finalized after executing this function.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     *
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databaseallsql-param--callback
     */
    all(...i) {
      return new Promise((o, s) => {
        this.stmt.all(...i, (a, c) => {
          if (a)
            return s((0, e.formatError)(a));
          o(c);
        });
      });
    }
    each(...i) {
      return new Promise((o, s) => {
        const a = i.pop();
        if (!a || typeof a != "function")
          throw new Error("sqlite: Last param of Statement#each() must be a callback function");
        if (i.length > 0) {
          const c = i.pop();
          if (typeof c == "function")
            throw new Error("sqlite: Statement#each() should only have a single callback defined. See readme for usage.");
          i.push(c);
        }
        this.stmt.each(...i, (c, l) => {
          if (c)
            return a((0, e.formatError)(c), null);
          a(null, l);
        }, (c, l) => {
          if (c)
            return s((0, e.formatError)(c));
          o(l);
        });
      });
    }
  };
  return A.Statement = t, A;
}
re();
var U = {}, O = {}, V;
function Te() {
  if (V) return O;
  V = 1, Object.defineProperty(O, "__esModule", { value: !0 }), O.migrate = O.readMigrations = void 0;
  const e = I, t = y;
  async function n(o) {
    const s = o || t.join(process.cwd(), "migrations"), a = t.resolve(s), c = await new Promise((l, m) => {
      e.readdir(a, (d, E) => {
        if (d)
          return m(d);
        l(E.map((r) => r.match(/^(\d+).(.*?)\.sql$/)).filter((r) => r !== null).map((r) => ({ id: Number(r[1]), name: r[2], filename: r[0] })).sort((r, u) => Math.sign(r.id - u.id)));
      });
    });
    if (!c.length)
      throw new Error(`No migration files found in '${a}'.`);
    return Promise.all(c.map((l) => new Promise((m, d) => {
      const E = t.join(a, l.filename);
      e.readFile(E, "utf-8", (r, u) => {
        if (r)
          return d(r);
        const [T, p] = u.split(/^--\s+?down\b/im), g = l;
        g.up = T.replace(/^-- .*?$/gm, "").trim(), g.down = p ? p.trim() : "", m(g);
      });
    })));
  }
  O.readMigrations = n;
  async function i(o, s = {}) {
    s.force = s.force || !1, s.table = s.table || "migrations";
    const { force: a, table: c } = s, l = s.migrations ? s.migrations : await n(s.migrationsPath);
    await o.run(`CREATE TABLE IF NOT EXISTS "${c}" (
  id   INTEGER PRIMARY KEY,
  name TEXT    NOT NULL,
  up   TEXT    NOT NULL,
  down TEXT    NOT NULL
)`);
    let m = await o.all(`SELECT id, name, up, down FROM "${c}" ORDER BY id ASC`);
    const d = l[l.length - 1];
    for (const r of m.slice().sort((u, T) => Math.sign(T.id - u.id)))
      if (!l.some((u) => u.id === r.id) || a && r.id === d.id) {
        await o.run("BEGIN");
        try {
          await o.exec(r.down), await o.run(`DELETE FROM "${c}" WHERE id = ?`, r.id), await o.run("COMMIT"), m = m.filter((u) => u.id !== r.id);
        } catch (u) {
          throw await o.run("ROLLBACK"), u;
        }
      } else
        break;
    const E = m.length ? m[m.length - 1].id : 0;
    for (const r of l)
      if (r.id > E) {
        await o.run("BEGIN");
        try {
          await o.exec(r.up), await o.run(`INSERT INTO "${c}" (id, name, up, down) VALUES (?, ?, ?, ?)`, r.id, r.name, r.up, r.down), await o.run("COMMIT");
        } catch (u) {
          throw await o.run("ROLLBACK"), u;
        }
      }
  }
  return O.migrate = i, O;
}
var q = {}, J;
function he() {
  if (J) return q;
  J = 1, Object.defineProperty(q, "__esModule", { value: !0 }), q.toSqlParams = void 0;
  function e(t, n = []) {
    return typeof t == "string" ? {
      sql: t,
      params: n
    } : {
      sql: t.sql,
      params: t.values
    };
  }
  return q.toSqlParams = e, q;
}
var Q;
function ge() {
  if (Q) return U;
  Q = 1, Object.defineProperty(U, "__esModule", { value: !0 }), U.Database = void 0;
  const e = re(), t = Te(), n = he(), i = ie();
  class o {
    constructor(a) {
      this.config = a, this.db = null;
    }
    /**
     * Event handler when verbose mode is enabled.
     * @see https://github.com/mapbox/node-sqlite3/wiki/Debugging
     */
    on(a, c) {
      this.db.on(a, c);
    }
    /**
     * Returns the underlying sqlite3 Database instance
     */
    getDatabaseInstance() {
      return this.db;
    }
    /**
     * Opens the database
     */
    open() {
      return new Promise((a, c) => {
        let { filename: l, mode: m, driver: d } = this.config;
        if (l == null)
          throw new Error("sqlite: filename cannot be null / undefined");
        if (!d)
          throw new Error("sqlite: driver is not defined");
        m ? this.db = new d(l, m, (E) => {
          if (E)
            return c((0, i.formatError)(E));
          a();
        }) : this.db = new d(l, (E) => {
          if (E)
            return c((0, i.formatError)(E));
          a();
        });
      });
    }
    /**
     * Closes the database.
     */
    close() {
      return new Promise((a, c) => {
        this.db.close((l) => {
          if (l)
            return c((0, i.formatError)(l));
          a();
        });
      });
    }
    /**
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databaseconfigureoption-value
     */
    configure(a, c) {
      this.db.configure(a, c);
    }
    /**
     * Runs the SQL query with the specified parameters. It does not retrieve any result data.
     * The function returns the Database object for which it was called to allow for function chaining.
     *
     * @param {string} sql The SQL query to run.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     *
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databaserunsql-param--callback
     */
    run(a, ...c) {
      return new Promise((l, m) => {
        const d = (0, n.toSqlParams)(a, c);
        this.db.run(d.sql, ...d.params, function(E) {
          if (E)
            return m((0, i.formatError)(E));
          l({
            stmt: new e.Statement(this.stmt),
            lastID: this.lastID,
            changes: this.changes
          });
        });
      });
    }
    /**
     * Runs the SQL query with the specified parameters and resolves with
     * with the first result row afterwards. If the result set is empty, returns undefined.
     *
     * The property names correspond to the column names of the result set.
     * It is impossible to access them by column index; the only supported way is by column name.
     *
     * @param {string} sql The SQL query to run.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     *
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databasegetsql-param--callback
     */
    get(a, ...c) {
      return new Promise((l, m) => {
        const d = (0, n.toSqlParams)(a, c);
        this.db.get(d.sql, ...d.params, (E, r) => {
          if (E)
            return m((0, i.formatError)(E));
          l(r);
        });
      });
    }
    each(a, ...c) {
      return new Promise((l, m) => {
        const d = c.pop();
        if (!d || typeof d != "function")
          throw new Error("sqlite: Last param of Database#each() must be a callback function");
        if (c.length > 0) {
          const r = c.pop();
          if (typeof r == "function")
            throw new Error("sqlite: Database#each() should only have a single callback defined. See readme for usage.");
          c.push(r);
        }
        const E = (0, n.toSqlParams)(a, c);
        this.db.each(E.sql, ...E.params, (r, u) => {
          if (r)
            return d((0, i.formatError)(r), null);
          d(null, u);
        }, (r, u) => {
          if (r)
            return m((0, i.formatError)(r));
          l(u);
        });
      });
    }
    /**
     * Runs the SQL query with the specified parameters. The parameters are the same as the
     * Database#run function, with the following differences:
     *
     * If the result set is empty, it will be an empty array, otherwise it will
     * have an object for each result row which
     * in turn contains the values of that row, like the Database#get function.
     *
     * Note that it first retrieves all result rows and stores them in memory.
     * For queries that have potentially large result sets, use the Database#each
     * function to retrieve all rows or Database#prepare followed by multiple
     * Statement#get calls to retrieve a previously unknown amount of rows.
     *
     * @param {string} sql The SQL query to run.
     *
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     *
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databaseallsql-param--callback
     */
    all(a, ...c) {
      return new Promise((l, m) => {
        const d = (0, n.toSqlParams)(a, c);
        this.db.all(d.sql, ...d.params, (E, r) => {
          if (E)
            return m((0, i.formatError)(E));
          l(r);
        });
      });
    }
    /**
     * Runs all SQL queries in the supplied string. No result rows are retrieved. If a query fails,
     * no subsequent statements will be executed (wrap it in a transaction if you want all
     * or none to be executed).
     *
     * Note: This function will only execute statements up to the first NULL byte.
     * Comments are not allowed and will lead to runtime errors.
     *
     * @param {string} sql The SQL query to run.
     * @see https://github.com/mapbox/node-sqlite3/wiki/API#databaseexecsql-callback
     */
    exec(a) {
      return new Promise((c, l) => {
        const m = (0, n.toSqlParams)(a);
        this.db.exec(m.sql, (d) => {
          if (d)
            return l((0, i.formatError)(d));
          c();
        });
      });
    }
    /**
     * Prepares the SQL statement and optionally binds the specified parameters.
     * When bind parameters are supplied, they are bound to the prepared statement.
     *
     * @param {string} sql The SQL query to run.
     * @param {any} [params, ...] When the SQL statement contains placeholders, you
     * can pass them in here. They will be bound to the statement before it is
     * executed. There are three ways of passing bind parameters: directly in
     * the function's arguments, as an array, and as an object for named
     * parameters. This automatically sanitizes inputs.
     * @returns Promise<Statement> Statement object
     */
    prepare(a, ...c) {
      return new Promise((l, m) => {
        const d = (0, n.toSqlParams)(a, c), E = this.db.prepare(d.sql, ...d.params, (r) => {
          if (r)
            return m(r);
          l(new e.Statement(E));
        });
      });
    }
    /**
     * Loads a compiled SQLite extension into the database connection object.
     *
     * @param {string} path Filename of the extension to load
     */
    loadExtension(a) {
      return new Promise((c, l) => {
        this.db.loadExtension(a, (m) => {
          if (m)
            return l((0, i.formatError)(m));
          c();
        });
      });
    }
    /**
     * Performs a database migration.
     */
    async migrate(a) {
      await (0, t.migrate)(this, a);
    }
    /**
     * The methods underneath requires creative work to implement. PRs / proposals accepted!
     */
    /*
     * Unsure if serialize can be made into a promise.
     */
    serialize() {
      throw new Error("sqlite: Currently not implemented. Use getDatabaseInstance().serialize() instead.");
    }
    /*
     * Unsure if parallelize can be made into a promise.
     */
    parallelize() {
      throw new Error("sqlite: Currently not implemented. Use getDatabaseInstance().parallelize() instead.");
    }
  }
  return U.Database = o, U;
}
var Re = ge();
const ye = /* @__PURE__ */ ne(Re);
async function Se(e) {
  const t = new ye.Database(e);
  return await t.open(), t;
}
let b = null;
async function be() {
  if (b) return b;
  const e = L ? L.getPath("userData") : y.join(process.cwd(), "database_data");
  I.existsSync(e) || I.mkdirSync(e, { recursive: !0 });
  const t = y.join(e, "biotechcentre.sqlite");
  return b = await Se({
    filename: t,
    driver: _e.Database
  }), await b.exec("PRAGMA journal_mode = WAL;"), await b.exec("PRAGMA foreign_keys = ON;"), console.log(`Database initialized at: ${t}`), b;
}
function f() {
  if (!b)
    throw new Error("Database not initialized. Call initDatabase first.");
  return b;
}
async function v(e) {
  const t = f();
  await t.exec("BEGIN TRANSACTION");
  try {
    const n = await e();
    return await t.exec("COMMIT"), n;
  } catch (n) {
    throw await t.exec("ROLLBACK"), n;
  }
}
const Ne = async (e) => {
  await e.exec(`
    CREATE TABLE IF NOT EXISTS company_details (
      id INTEGER PRIMARY KEY DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT,
      slogan TEXT,
      address TEXT,
      gstin TEXT,
      account_name TEXT,
      account_number TEXT,
      account_type TEXT,
      bank_name TEXT,
      ifsc_code TEXT,
      CHECK (id = 1)
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      email TEXT,
      phone TEXT,
      gst_pan TEXT,
      billing_address TEXT,
      is_guest INTEGER NOT NULL DEFAULT 0
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS units (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      abbreviation TEXT NOT NULL UNIQUE
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      icon_name TEXT
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      hsn_code TEXT,
      stock_quantity INTEGER NOT NULL DEFAULT 0,
      unit_price REAL NOT NULL,
      tax_rate REAL NOT NULL,
      unit_id TEXT,
      category_id TEXT,
      FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
      CHECK (stock_quantity >= 0),
      CHECK (unit_price >= 0),
      CHECK (tax_rate >= 0 AND tax_rate <= 1)
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      product_id TEXT NOT NULL,
      purchase_date TEXT NOT NULL,
      reference_invoice TEXT,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      CHECK (quantity > 0)
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      customer_id TEXT,
      invoice_number TEXT NOT NULL UNIQUE,
      invoice_date TEXT NOT NULL,
      notes TEXT,
      total_amount REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT
    );
  `), await e.exec(`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      invoice_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      tax_rate REAL NOT NULL,
      FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
      CHECK (quantity > 0),
      CHECK (unit_price >= 0),
      CHECK (tax_rate >= 0 AND tax_rate <= 1)
    );
  `);
  const t = [
    ["Fertilizers", "Nutrients for plant growth", "Leaf"],
    ["Organic Fertilizers", "Natural fertilizers derived from plant or animal matter", "Sprout"],
    ["Chemical Fertilizers (Urea, DAP, NPK)", "Synthetic fertilizers providing specific nutrients", "FlaskConical"],
    ["Micronutrients", "Essential elements required by plants in small quantities", "TestTube2"],
    ["Pesticides & Crop Protection", "Chemicals to control pests, diseases, and weeds", "Shield"],
    ["Insecticides", "Substances used to kill insects", "Bug"],
    ["Fungicides", "Biocidal chemical compounds used to kill parasitic fungi", "SunSnow"],
    ["Herbicides", "Substances that are toxic to plants, used to destroy unwanted vegetation", "Ban"],
    ["Bio-Pesticides", "Pesticides derived from natural materials like animals, plants, bacteria", "Trees"]
  ];
  for (const [n, i, o] of t) {
    const s = crypto.randomUUID();
    await e.run(
      "INSERT OR IGNORE INTO categories (id, name, description, icon_name) VALUES (?, ?, ?, ?)",
      [s, n, i, o]
    );
  }
};
async function Oe(e) {
  const t = await e.get("SELECT COUNT(*) as count FROM products");
  if (t && t.count > 0) {
    console.log("Database already has product records, skipping seed.");
    return;
  }
  const n = [
    y.join(process.cwd(), "database_data", "seed_data.json"),
    y.join(__dirname, "..", "..", "database_data", "seed_data.json"),
    y.join(__dirname, "..", "database_data", "seed_data.json")
  ];
  let i = null;
  for (const o of n)
    if (I.existsSync(o)) {
      i = o;
      break;
    }
  if (!i) {
    console.log("No seed_data.json found. Skipping initial data seed.");
    return;
  }
  console.log(`Loading initial data from: ${i}`);
  try {
    const o = I.readFileSync(i, "utf-8"), s = JSON.parse(o), a = [
      "company_details",
      "units",
      "categories",
      "customers",
      "products",
      "purchases",
      "invoices",
      "invoice_items"
    ];
    await e.exec("PRAGMA foreign_keys = OFF;"), await e.exec("BEGIN TRANSACTION;");
    let c = 0;
    for (const l of a) {
      const m = s[l];
      if (Array.isArray(m) && m.length > 0)
        for (const d of m) {
          const E = Object.keys(d), r = E.map(() => "?").join(", "), u = Object.values(d).map((T) => typeof T == "boolean" ? T ? 1 : 0 : T === void 0 ? null : T);
          await e.run(
            `INSERT OR REPLACE INTO ${l} (${E.join(", ")}) VALUES (${r})`,
            u
          ), c++;
        }
    }
    await e.exec("COMMIT;"), await e.exec("PRAGMA foreign_keys = ON;"), console.log(`Successfully seeded ${c} records from Supabase backup.`);
  } catch (o) {
    await e.exec("ROLLBACK;").catch(() => {
    }), await e.exec("PRAGMA foreign_keys = ON;").catch(() => {
    }), console.error("Error seeding initial data:", o);
  }
}
async function we() {
  const e = f();
  await e.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const t = [
    { name: "001_initial_schema", up: Ne },
    { name: "002_seed_initial_data", up: Oe }
  ];
  for (const n of t)
    if (!await e.get("SELECT id FROM _migrations WHERE name = ?", n.name)) {
      console.log(`Running migration: ${n.name}`);
      try {
        await n.up(e), await e.run("INSERT INTO _migrations (name) VALUES (?)", n.name), console.log(`Migration ${n.name} completed.`);
      } catch (o) {
        throw console.error(`Migration ${n.name} failed:`, o), o;
      }
    }
}
async function W() {
  const e = f();
  let t = await e.get("SELECT * FROM company_details WHERE id = 1");
  return t || (await e.run('INSERT INTO company_details (id, name) VALUES (1, "")'), t = await e.get("SELECT * FROM company_details WHERE id = 1")), t;
}
async function Le(e) {
  const t = f(), n = Object.keys(e).filter((s) => s !== "id" && s !== "created_at");
  if (n.length === 0) return W();
  const i = n.map((s) => `${s} = ?`).join(", "), o = n.map((s) => e[s]);
  return await t.run(`UPDATE company_details SET ${i} WHERE id = 1`, ...o), W();
}
async function Ie() {
  return f().all("SELECT * FROM units ORDER BY name ASC");
}
async function ve(e) {
  const t = f(), n = N.randomUUID();
  return await t.run(
    "INSERT INTO units (id, name, abbreviation) VALUES (?, ?, ?)",
    [n, e.name, e.abbreviation]
  ), t.get("SELECT * FROM units WHERE id = ?", n);
}
async function Ae(e, t) {
  const n = f();
  return await n.run(
    "UPDATE units SET name = ?, abbreviation = ? WHERE id = ?",
    [t.name, t.abbreviation, e]
  ), n.get("SELECT * FROM units WHERE id = ?", e);
}
async function Ce() {
  return f().all("SELECT * FROM categories ORDER BY name ASC");
}
async function Ue(e) {
  const t = f(), n = N.randomUUID();
  return await t.run(
    "INSERT INTO categories (id, name, description, icon_name) VALUES (?, ?, ?, ?)",
    [n, e.name, e.description, e.icon_name]
  ), t.get("SELECT * FROM categories WHERE id = ?", n);
}
async function qe(e, t) {
  const n = f();
  return await n.run(
    "UPDATE categories SET name = ?, description = ?, icon_name = ? WHERE id = ?",
    [t.name, t.description, t.icon_name, e]
  ), n.get("SELECT * FROM categories WHERE id = ?", e);
}
async function Me(e) {
  await f().run("DELETE FROM categories WHERE id = ?", e);
}
async function Pe(e) {
  const t = f();
  let n = "SELECT * FROM customers";
  const i = [];
  return e !== void 0 && (n += " WHERE is_guest = ?", i.push(e ? 1 : 0)), n += " ORDER BY name ASC", t.all(n, ...i);
}
async function De(e) {
  return f().get("SELECT * FROM customers WHERE id = ?", e);
}
async function Fe(e) {
  const t = f(), n = N.randomUUID();
  return await t.run(
    "INSERT INTO customers (id, name, email, phone, gst_pan, billing_address, is_guest) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [n, e.name, e.email, e.phone, e.gst_pan, e.billing_address, e.is_guest ? 1 : 0]
  ), t.get("SELECT * FROM customers WHERE id = ?", n);
}
async function ke(e, t) {
  const n = f(), i = Object.keys(t).filter((o) => o !== "id" && o !== "created_at");
  if (i.length > 0) {
    const o = i.map((a) => `${a} = ?`).join(", "), s = i.map((a) => typeof t[a] == "boolean" ? t[a] ? 1 : 0 : t[a]);
    await n.run(`UPDATE customers SET ${o} WHERE id = ?`, ...s, e);
  }
  return n.get("SELECT * FROM customers WHERE id = ?", e);
}
function ae(e) {
  return {
    ...e,
    units: e.unit_abbreviation ? { abbreviation: e.unit_abbreviation } : null,
    categories: e.category_name ? { name: e.category_name, icon_name: e.category_icon } : null
  };
}
async function xe() {
  return (await f().all(`
    SELECT p.*, u.abbreviation as unit_abbreviation, c.name as category_name, c.icon_name as category_icon
    FROM products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.name ASC
  `)).map(ae);
}
async function H(e) {
  const n = await f().get(`
    SELECT p.*, u.abbreviation as unit_abbreviation, c.name as category_name, c.icon_name as category_icon
    FROM products p
    LEFT JOIN units u ON p.unit_id = u.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `, e);
  return n ? ae(n) : null;
}
async function We(e) {
  const t = f(), n = N.randomUUID();
  return await t.run(`
    INSERT INTO products (id, name, description, hsn_code, stock_quantity, unit_price, tax_rate, unit_id, category_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    n,
    e.name,
    e.description,
    e.hsn_code,
    e.stock_quantity || 0,
    e.unit_price,
    e.tax_rate,
    e.unit_id,
    e.category_id
  ]), H(n);
}
async function He(e, t) {
  const n = f(), i = Object.keys(t).filter((o) => o !== "id" && o !== "created_at" && o !== "units" && o !== "categories");
  if (i.length > 0) {
    const o = i.map((a) => `${a} = ?`).join(", "), s = i.map((a) => t[a]);
    await n.run(`UPDATE products SET ${o} WHERE id = ?`, ...s, e);
  }
  return H(e);
}
async function je() {
  return (await f().all(`
    SELECT p.*, pr.name as product_name, pr.unit_price as product_unit_price
    FROM purchases p
    JOIN products pr ON p.product_id = pr.id
    ORDER BY p.purchase_date DESC, p.created_at DESC
  `)).map((n) => ({
    ...n,
    products: { name: n.product_name, unit_price: n.product_unit_price }
  }));
}
async function Xe(e) {
  return v(async () => {
    const t = f(), n = N.randomUUID();
    return await t.run(
      "INSERT INTO purchases (id, product_id, purchase_date, reference_invoice, quantity) VALUES (?, ?, ?, ?, ?)",
      [n, e.product_id, e.purchase_date, e.reference_invoice, e.quantity]
    ), await t.run(
      "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
      [e.quantity, e.product_id]
    ), t.get("SELECT * FROM purchases WHERE id = ?", n);
  });
}
async function Be(e, t) {
  return v(async () => {
    const n = f(), i = await n.get("SELECT * FROM purchases WHERE id = ?", e);
    if (!i) throw new Error("Purchase not found");
    await n.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [i.quantity, i.product_id]);
    const o = Object.keys(t).filter((a) => a !== "id" && a !== "created_at" && a !== "products");
    if (o.length > 0) {
      const a = o.map((l) => `${l} = ?`).join(", "), c = o.map((l) => t[l]);
      await n.run(`UPDATE purchases SET ${a} WHERE id = ?`, ...c, e);
    }
    const s = await n.get("SELECT * FROM purchases WHERE id = ?", e);
    return await n.run("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [s.quantity, s.product_id]), s;
  });
}
async function $e(e) {
  return v(async () => {
    const t = f(), n = await t.get("SELECT * FROM purchases WHERE id = ?", e);
    if (!n) throw new Error("Purchase not found");
    const i = await t.get("SELECT stock_quantity FROM products WHERE id = ?", n.product_id);
    if (i && i.stock_quantity - n.quantity < 0)
      throw new Error("Cannot delete this purchase. It would result in a negative stock level.");
    await t.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [n.quantity, n.product_id]), await t.run("DELETE FROM purchases WHERE id = ?", e);
  });
}
async function Ye() {
  return (await f().all(`
    SELECT i.*, c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    ORDER BY i.invoice_date DESC, i.created_at DESC
  `)).map((n) => ({
    ...n,
    customers: n.customer_name ? { name: n.customer_name } : null
  }));
}
async function j(e) {
  const t = f(), n = await t.get(`
    SELECT i.*, c.name as customer_name
    FROM invoices i
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE i.id = ?
  `, e);
  if (!n) return null;
  const i = await t.all(`
    SELECT ii.*, p.name as product_name, p.hsn_code, u.abbreviation as unit_abbreviation
    FROM invoice_items ii
    JOIN products p ON ii.product_id = p.id
    LEFT JOIN units u ON p.unit_id = u.id
    WHERE ii.invoice_id = ?
  `, e);
  return {
    ...n,
    customers: n.customer_name ? { name: n.customer_name } : null,
    invoice_items: i.map((o) => ({
      ...o,
      products: { name: o.product_name, hsn_code: o.hsn_code, units: { abbreviation: o.unit_abbreviation } }
    }))
  };
}
async function Ke(e, t) {
  return v(async () => {
    const n = f(), i = N.randomUUID();
    let o = 0;
    const s = t.map((a) => {
      const c = N.randomUUID(), l = a.quantity * a.unit_price * (1 + a.tax_rate);
      return o += l, { ...a, id: c };
    });
    await n.run(`
      INSERT INTO invoices (id, customer_id, invoice_number, invoice_date, notes, total_amount)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [i, e.customer_id, e.invoice_number, e.invoice_date, e.notes, o]);
    for (const a of s)
      await n.run(`
         INSERT INTO invoice_items (id, invoice_id, product_id, quantity, unit_price, tax_rate)
         VALUES (?, ?, ?, ?, ?, ?)
       `, [a.id, i, a.product_id, a.quantity, a.unit_price, a.tax_rate]), await n.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [a.quantity, a.product_id]);
    return j(i);
  });
}
async function Ge(e, t, n) {
  return v(async () => {
    const i = f(), o = await i.all("SELECT * FROM invoice_items WHERE invoice_id = ?", e);
    for (const a of o)
      await i.run("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [a.quantity, a.product_id]);
    await i.run("DELETE FROM invoice_items WHERE invoice_id = ?", e);
    let s = 0;
    for (const a of n) {
      const c = N.randomUUID(), l = a.quantity * a.unit_price * (1 + a.tax_rate);
      s += l, await i.run(`
         INSERT INTO invoice_items (id, invoice_id, product_id, quantity, unit_price, tax_rate)
         VALUES (?, ?, ?, ?, ?, ?)
       `, [c, e, a.product_id, a.quantity, a.unit_price, a.tax_rate]), await i.run("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [a.quantity, a.product_id]);
    }
    return await i.run(`
      UPDATE invoices 
      SET customer_id = ?, invoice_number = ?, invoice_date = ?, notes = ?, total_amount = ?
      WHERE id = ?
    `, [t.customer_id, t.invoice_number, t.invoice_date, t.notes, s, e]), j(e);
  });
}
async function ze(e) {
  return v(async () => {
    const t = f(), n = await t.all("SELECT * FROM invoice_items WHERE invoice_id = ?", e);
    for (const i of n)
      await t.run("UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?", [i.quantity, i.product_id]);
    await t.run("DELETE FROM invoice_items WHERE invoice_id = ?", e), await t.run("DELETE FROM invoices WHERE id = ?", e);
  });
}
async function Ve(e, t, n, i, o) {
  return f().all(`
    WITH combined AS (
      SELECT
          ii.id AS transaction_id,
          i.invoice_date AS transaction_date,
          'Sale' AS transaction_type,
          i.invoice_number AS reference_number,
          p.name AS product_name,
          -ii.quantity AS quantity_change
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      JOIN products p ON ii.product_id = p.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT
          pu.id AS transaction_id,
          pu.purchase_date AS transaction_date,
          'Purchase' AS transaction_type,
          pu.reference_invoice AS reference_number,
          p.name AS product_name,
          pu.quantity AS quantity_change
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT * FROM combined
    ORDER BY transaction_date DESC, product_name ASC
    LIMIT ? OFFSET ?
  `, [n, n, e, t, n, n, e, t, i, o]);
}
async function Je(e, t, n) {
  const s = await f().get(`
    WITH combined AS (
      SELECT ii.id
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      UNION ALL
      SELECT pu.id
      FROM purchases pu
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT COUNT(*) as total FROM combined
  `, [n, n, e, t, n, n, e, t]);
  return s ? s.total : 0;
}
async function Qe(e, t, n) {
  return f().all(`
    WITH combined AS (
      SELECT
          i.invoice_date AS transaction_date,
          'Sale' AS transaction_type,
          i.invoice_number AS reference_number,
          p.name AS product_name,
          -ii.quantity AS quantity_change
      FROM invoice_items ii
      JOIN invoices i ON ii.invoice_id = i.id
      JOIN products p ON ii.product_id = p.id
      WHERE (? = 'all' OR ? = 'sale')
        AND i.invoice_date BETWEEN ? AND ?
      
      UNION ALL
      
      SELECT
          pu.purchase_date AS transaction_date,
          'Purchase' AS transaction_type,
          pu.reference_invoice AS reference_number,
          p.name AS product_name,
          pu.quantity AS quantity_change
      FROM purchases pu
      JOIN products p ON pu.product_id = p.id
      WHERE (? = 'all' OR ? = 'purchase')
        AND pu.purchase_date BETWEEN ? AND ?
    )
    SELECT * FROM combined
    ORDER BY transaction_date DESC, product_name ASC
  `, [n, n, e, t, n, n, e, t]);
}
async function Ze(e) {
  return (await f().all(`
    SELECT ii.*, i.invoice_number, i.invoice_date, c.name as customer_name
    FROM invoice_items ii
    JOIN invoices i ON ii.invoice_id = i.id
    LEFT JOIN customers c ON i.customer_id = c.id
    WHERE ii.product_id = ?
    ORDER BY i.invoice_date DESC
  `, e)).map((i) => ({
    ...i,
    invoices: {
      invoice_number: i.invoice_number,
      invoice_date: i.invoice_date,
      customers: i.customer_name ? { name: i.customer_name } : null
    }
  }));
}
function et() {
  _.handle("company:get", () => W()), _.handle("company:update", (e, t) => Le(t)), _.handle("units:list", () => Ie()), _.handle("units:create", (e, t) => ve(t)), _.handle("units:update", (e, t, n) => Ae(t, n)), _.handle("categories:list", () => Ce()), _.handle("categories:create", (e, t) => Ue(t)), _.handle("categories:update", (e, t, n) => qe(t, n)), _.handle("categories:delete", (e, t) => Me(t)), _.handle("customers:list", (e, t) => Pe(t)), _.handle("customers:get", (e, t) => De(t)), _.handle("customers:create", (e, t) => Fe(t)), _.handle("customers:update", (e, t, n) => ke(t, n)), _.handle("products:list", () => xe()), _.handle("products:get", (e, t) => H(t)), _.handle("products:create", (e, t) => We(t)), _.handle("products:update", (e, t, n) => He(t, n)), _.handle("purchases:list", () => je()), _.handle("purchases:create", (e, t) => Xe(t)), _.handle("purchases:update", (e, t, n) => Be(t, n)), _.handle("purchases:delete", (e, t) => $e(t)), _.handle("invoices:list", () => Ye()), _.handle("invoices:get", (e, t) => j(t)), _.handle("invoices:create", (e, t, n) => Ke(t, n)), _.handle("invoices:update", (e, t, n, i) => Ge(t, n, i)), _.handle("invoices:delete", (e, t) => ze(t)), _.handle("reports:combined", (e, t, n, i, o, s) => Ve(t, n, i, o, s)), _.handle("reports:combinedCount", (e, t, n, i) => Je(t, n, i)), _.handle("reports:exportCombined", (e, t, n, i) => Qe(t, n, i)), _.handle("reports:productStock", (e, t) => Ze(t)), _.handle("health:ping", () => "pong");
}
const Z = y.dirname(oe(import.meta.url));
let x = null;
async function ee() {
  try {
    await be(), await we(), et();
  } catch (e) {
    console.error("Failed to initialize database or IPC:", e);
  }
  x = new te({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: y.join(Z, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), process.env.VITE_DEV_SERVER_URL ? x.loadURL(process.env.VITE_DEV_SERVER_URL) : x.loadFile(y.join(Z, "../dist/index.html"));
}
L.whenReady().then(() => {
  ee(), L.on("activate", () => {
    te.getAllWindows().length === 0 && ee();
  });
});
L.on("window-all-closed", () => {
  process.platform !== "darwin" && L.quit();
});
