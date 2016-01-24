$(document).ready(function () {
    size = 3;
    box1 = null;
    box2 = null;
    highscore = 0;
    gamesPlayed = -1;
    average = 0;
    max = size * size;

    initGrid();
    $("div.controls").hide();
    $("#reset").click(function () {
        //aggregate scores
        if (score > highscore) {
            highscore = score;
            $("#highscore").text("High Score: " + highscore);
        }
        gamesPlayed++;
        if (gamesPlayed != 0) {
            average = (average * (gamesPlayed - 1) + score) / gamesPlayed;
            $("#average").text("Average Score: " + Math.round(average));
        }
        initGrid();
    });

    $("img").click(function () {
        $("div.controls").toggle();
    });

});

function niner(button) {
    if (!setBox(button)) return;

    if (box2 == null) return;

    //add numbers
    var s1 = num1;
    var s2 = num2;
    sum = s1 + s2;
    dif = Math.abs(s1 - s2);
    num1 = null;
    num2 = null;

    //set box values
    var source = $("#row" + box1.x + " #col" + box1.y);
    var target = $("#row" + box2.x + " #col" + box2.y);
    source.text(dif);
    target.text(sum);

    setColor(source);
    setColor(target);
    deselect();

    setScore();
}



function deselect() {
    box1 = null;
    box2 = null;
    num1 = null;
    num2 = null;
    $(".selected").removeClass("selected");
}


function setColor(element) {
    var x = element.text();
    element.removeClass("bust");
    element.removeClass("max");
    element.removeClass("less");
    if (x < max) element.addClass("less");
    if (x > max) element.addClass("bust");
    if (x == max) element.addClass("max");
}


function setScore() {
    score = 0;
    for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            var boxVal = Number($("#row" + x + " #col" + y).text());
            if (boxVal > max) continue;
            if (boxVal < max) score += boxVal;
            else if (boxVal == max) score += boxVal * 2;
        }
    }
    $("#score").text("Score: " + score);
    if (score == max * size * size * 2) {
        $("td").css("border", "white 2px solid");
        $("td").unbind("click");
    }
}



function initGrid() {
    num1 = null;
    num2 = null;
    score = 0;
    var toAppend;
    $("#grid").html("");

    //set table elements 
    for (var x = 0; x < size; x++) {
        toAppend += "<tr id=\"row" + x + "\">";
        for (var y = 0; y < size; y++) {
            toAppend += "<td id=\"col" + y + "\">" + Math.floor(Math.random() * max) + "</td>";
        }
        toAppend += "</tr>";
    }
    $("#grid").append(toAppend);
    $("#grid td").click(function () {
        niner(this);
    });
    //set values so numbers arent too high or too low
    levelGrid();
    //set some text
    $("#score").text("Score: " + score);
    $("#target").text("Get all of the boxes to be as close to " + max + " as possible. The game ends when you choose to end it. You don't really win until you get a perfect score.");
}

function levelGrid() {
    var total = 0;
    for (var x = 0; x < size; x++) {
        for (var y = 0; y < size; y++) {
            total += Number($("#row" + x + " #col" + y).text());
        }
    }

    var inc = 1;
    var avg = Math.round(((max - 1) / 2) * size * size);
    if (avg % 2 == 1) avg--;
    avg = Math.round(avg * 3 / 4);
    score = avg;

    if (total == 2) return;
    if (total > avg) inc = -1;
    while (total != avg) {

        var boxX = Math.floor(Math.random() * size);
        var boxY = Math.floor(Math.random() * size);
        var box = $("#row" + boxX + " #col" + boxY);

        if (inc < 0 && Number(box.text()) == 0) continue;
        if (inc > 0 && Number(box.text()) == max - 1) continue;

        box.text(Number(box.text()) + inc);
        total += inc;
    }
}
function setBox(button) {
    //get box location
    var boxX = $(button).parent().attr("id").substr(3, 1);
    var boxY = $(button).attr("id").substr(3, 1);

    $(button).addClass("selected");
    num = Number($(button).text());

    if (box1 == null) {
        box1 = {
            x: boxX,
            y: boxY
        };
        num1 = num;
        return true;
    }
    box2 = {
        x: boxX,
        y: boxY
    };
    num2 = num;
    if (!isValid(boxX, boxY)) {
        deselect();
        return false;
    }

    return true;

}

function isValid(x, y) {
    var distX = Math.abs(box2.x - box1.x);
    var distY = Math.abs(box2.y - box1.y);

    if (distX + distY == 1) return true;;
    return false;
}

function incSize(x) {
    size += x;
    if (size < 2 || size > 10) {
        size -= x;
        return;
    }
    average = 0;
    highscore = 0;
    incMax(size * size - max);
    $("#size").text("Size: " + size);
    initGrid();
}

function incMax(x) {
    max += x;
    if (max < 2 || max > 256) {
        max -= x;
        return;
    }
    average = 0;
    highscore = 0;
    $("#max").text("Target: " + max);
    initGrid();
}