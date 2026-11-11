(function () {

    var sizes = [4, 8, 12, 16];

    var state = {
        bits: 8,
        n: 0,
        solved: false,
        streak: 0,
        best: 0
    };

    var $ = function (id) {
        return document.getElementById(id);
    };

    var bitsEl = $("bits");
    var ans = $("answer");
    var msg = $("msg");
    var checkBtn = $("check");

    function say(text, cls) {
        msg.textContent = text;
        msg.className = "msg " + (cls || "");
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

        bitsEl.setAttribute("aria-label", "Binary " + s);
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

        checkBtn.textContent = "Check answer";
        $("skip").textContent = "Show answer";

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
            say("Enter a whole number, like 42.", "bad");
            return;
        }

        if (parseInt(raw, 10) === state.n) {

            state.solved = true;

            setStreak(state.streak + 1);

            say("Correct! " + state.n + " it is.", "good");

            checkBtn.textContent = "Next number";
            ans.disabled = true;

            checkBtn.focus();

        } else {

            setStreak(0);

            say("Not quite. Check each place value and try again.", "bad");

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

        say("The correct answer was " + state.n + ".", "bad");

        checkBtn.textContent = "Next number";
        $("skip").textContent = "Next number";
    }

    sizes.forEach(function (n) {

        var b = document.createElement("button");

        b.textContent = n + " bit";
        b.className = "ghost";

        b.setAttribute("aria-pressed", n === state.bits);

        b.onclick = function () {

            state.bits = n;
            setStreak(0);

            Array.prototype.forEach.call(
                $("size").children,
                function (c, i) {
                    c.setAttribute("aria-pressed", sizes[i] === n);
                }
            );

            next();
        };

        $("size").appendChild(b);

    });

    checkBtn.onclick = check;
    $("skip").onclick = skip;

    ans.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {
            check();
        }

    });

    next();

})();
