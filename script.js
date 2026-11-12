(function () {
    var sizes = [4, 8, 12, 16];

    // All text lives here. Values can be strings or functions (for dynamic parts).
    var strings = {
        en: {
            pageTitle: "Read the Binary",
            module: "Binary training module",
            title: "Read the Binary",
            sub: "Test your understanding of binary numbers. Convert the bits below into their decimal equivalent.",
            repr: "Binary representation",
            label: "Your answer (decimal)",
            placeholder: "Enter decimal value...",
            check: "Check answer",
            next: "Next number",
            show: "Show answer",
            bitLength: "Bit length",
            bitUnit: function (n) { return n + " bit"; },
            streak: "Streak",
            best: "Best",
            credits: "Binary Training · Learn one bit at a time",
            sizeGroup: "Number of bits",
            ariaBinary: "Binary ",
            needNumber: "Enter a whole number",
            correct: function (n) { return "Correct! " + n + " it is."; },
            wrong: "Not quite. Check each place value and try again.",
            reveal: function (n) { return "The correct answer was " + n + "."; },
            langBtn: "日本語"
        },
        ja: {
            pageTitle: "バイナリを読もう",
            module: "バイナリ訓練モジュール",
            title: "バイナリを読もう",
            sub: "二進数の理解度を試しましょう。下のビットを十進数に変換してください。",
            repr: "二進数表示",
            label: "あなたの答え(十進数)",
            placeholder: "十進数を入力...",
            check: "答え合わせ",
            next: "次の数字",
            show: "答えを見る",
            bitLength: "ビット長",
            bitUnit: function (n) { return n + "ビット"; },
            streak: "連続正解",
            best: "最高記録",
            credits: "バイナリ訓練 ・ 一度に1ビットずつ学ぼう",
            sizeGroup: "ビット数",
            ariaBinary: "二進数 ",
            needNumber: "整数を入力してください",
            correct: function (n) { return "正解!答えは " + n + " です。"; },
            wrong: "惜しい!各桁の値を確認して、もう一度試してください。",
            reveal: function (n) { return "正解は " + n + " でした。"; },
            langBtn: "English"
        }
    };

    var state = {
        bits: 8,
        n: 0,
        solved: false,
        streak: 0,
        best: 0,
        lang: "en",
        // remembers the current message so it can be re-translated
        msg: { key: "", cls: "", arg: null }
    };

    try {
        var saved = localStorage.getItem("lang");
        if (saved && strings[saved]) state.lang = saved;
    } catch (e) { }

    var $ = function (id) {
        return document.getElementById(id);
    };

    var bitsEl = $("bits");
    var ans = $("answer");
    var msg = $("msg");
    var checkBtn = $("check");
    var skipBtn = $("skip");
    var langBtn = $("lang");

    // translate a key; calls it if it's a function
    function t(key, arg) {
        var v = strings[state.lang][key];
        return typeof v === "function" ? v(arg) : v;
    }

    function say(key, cls, arg) {
        state.msg = { key: key || "", cls: cls || "", arg: arg };
        msg.textContent = key ? t(key, arg) : "";
        msg.className = "msg " + (cls || "");
    }

    function updateButtons() {
        checkBtn.textContent = state.solved ? t("next") : t("check");
        skipBtn.textContent = state.solved ? t("next") : t("show");
    }

    function applyLang() {
        document.documentElement.lang = state.lang;
        document.title = t("pageTitle");

        Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
            el.textContent = t(el.getAttribute("data-i18n"));
        });

        Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-placeholder]"), function (el) {
            el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
        });

        $("size").setAttribute("aria-label", t("sizeGroup"));

        Array.prototype.forEach.call($("size").children, function (c, i) {
            c.textContent = t("bitUnit", sizes[i]);
        });

        langBtn.textContent = t("langBtn");

        updateButtons();
        say(state.msg.key, state.msg.cls, state.msg.arg);
        render();
    }

    function render() {
        var s = state.n.toString(2);

        while (s.length < state.bits) {
            s = "0" + s;
        }

        bitsEl.innerHTML = "";

        for (var i = 0; i < s.length; i += 4) {
            var nib = document.createElement("div");
            nib.className = "nib";

            s.slice(i, i + 4).split("").forEach(function (b) {
                var d = document.createElement("div");
                d.className = "bit" + (b === "0" ? " zero" : "");
                d.textContent = b;
                nib.appendChild(d);
            });

            bitsEl.appendChild(nib);
        }

        bitsEl.setAttribute("aria-label", t("ariaBinary") + s);
    }

    function next() {
        var max = Math.pow(2, state.bits);
        var n;

        do {
            n = Math.floor(Math.random() * max);
        } while (n === state.n && max > 1);

        state.n = n;
        state.solved = false;

        ans.value = "";
        ans.disabled = false;

        updateButtons();
        say("");
        render();

        ans.focus();
    }

    function setStreak(v) {
        state.streak = v;

        if (v > state.best) {
            state.best = v;
        }

        $("streak").textContent = state.streak;
        $("best").textContent = state.best;
    }

    function check() {
        if (state.solved) {
            next();
            return;
        }

        var raw = ans.value.trim();

        if (!/^\d+$/.test(raw)) {
            say("needNumber", "bad");
            return;
        }

        if (parseInt(raw, 10) === state.n) {
            state.solved = true;
            setStreak(state.streak + 1);
            say("correct", "good", state.n);
            ans.disabled = true;
            updateButtons();
            checkBtn.focus();
        } else {
            setStreak(0);
            say("wrong", "bad");

            bitsEl.classList.remove("shake");
            void bitsEl.offsetWidth;
            bitsEl.classList.add("shake");

            ans.select();
        }
    }

    function skip() {
        if (state.solved) {
            next();
            return;
        }

        setStreak(0);
        state.solved = true;
        ans.disabled = true;

        say("reveal", "bad", state.n);
        updateButtons();
    }

    sizes.forEach(function (n) {
        var b = document.createElement("button");

        b.className = "ghost";
        b.setAttribute("aria-pressed", String(n === state.bits));

        b.onclick = function () {
            state.bits = n;
            setStreak(0);

            Array.prototype.forEach.call($("size").children, function (c, i) {
                c.setAttribute("aria-pressed", String(sizes[i] === n));
            });

            next();
        };

        $("size").appendChild(b);
    });

    langBtn.onclick = function () {
        state.lang = state.lang === "en" ? "ja" : "en";
        try { localStorage.setItem("lang", state.lang); } catch (e) { }
        applyLang();
    };

    checkBtn.onclick = check;
    skipBtn.onclick = skip;

    ans.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            check();
        }
    });

    next();
    applyLang();
})();