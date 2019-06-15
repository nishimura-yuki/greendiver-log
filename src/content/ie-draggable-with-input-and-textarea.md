---
date: "2018-12-22T10:07:04Z"
version: 1
title: "IE11で「draggable = true」内のinput, textareaがうまく動かないので対策した"
tags: ["javascript"]
---

タイトルの通り、IE11でドラッグ&ドロップできる要素内にinput, textareaタグを入れた場合、インプット領域をクリックしてもカーソルが合わない(ダブルクリックとかしまくるとかろうじて合う)問題に直面したのでいろいろ調べて対策した。
手元にあるのがIE11だけだったのでEdgeやIE10とかは確認していないけど同じ問題があるかもしれない。

(そもそもドラッグできる要素内にテキスト入力領域があるのはUIとしてどうなの？という話もあるけど、、

## 元ソースコード
```javascript
<pre class="wp-block-syntaxhighlighter-code brush: xml; notranslate"><div draggable="true" id="draggable">
	<p>テキストエリア入力欄</p>
	<textarea name="area" rows="4" cols="40"></textarea>
</div></pre>
```

## 対策の方針

後述する参考記事にも記載されているが、`mousedown` `focus` `blur` イベントを駆使して以下の方針で対策。

* 「draggable = true」の要素に mousedown, focus, blur のイベントハンドラを登録
* mousedown イベント発火時にinput, textareaを強制的にfocusさせ、draggable属性をfalseに書き換える(同様にクリック以外の方法でfocusされた場合もdraggable属性をfalseにする)
* blurイベント発火時にdraggable属性をtrueに戻す

※ 子要素のinput, textarea側にイベント処理仕込む方法もあるけど、それだと修正範囲が多かったのでdraggable属性が指定された要素で調整する方針にした

## 修正後ソースコード
```javascript
<pre class="wp-block-syntaxhighlighter-code brush: jscript; notranslate"><div draggable="true" id="draggable">
	<p>テキストエリア入力欄</p>
	<textarea name="area" rows="4" cols="40"></textarea>
</div>

// イベントハンドリングのスクリプト追加
<script>
	var draggableElm = document.getElementById("draggable");

	draggableElm.addEventListener('mousedown', function(e){
		if (e.target) {
            var tagName = e.target.tagName;
            if (tagName === 'TEXTAREA' || tagName === 'INPUT') {
              if (typeof e.target.focus === 'function') e.target.focus();
              draggableElm.draggable = false;
            }
        }
	}, { capture: true });

	draggableElm.addEventListener('focus', function(e){
        if (e.target) {
        	var tagName = e.target.tagName;
            if (tagName === 'TEXTAREA' || tagName === 'INPUT') {
              draggableElm.draggable = false;
            }
        }
	}, { capture: true });

	draggableElm.addEventListener('blur', function(e){
        if (e.target) {
        	var tagName = e.target.tagName;
            if (tagName === 'TEXTAREA' || tagName === 'INPUT') {
              draggableElm.draggable = true;
            }
        }
	}, { capture: true });
</script></pre>
```

addEventListenerの第三引数で `capture` に true を指定することで子要素(今回だとinputとtextarea)のイベント発生よりも前に処理できるようにしているのがポイントです。(このへんのイベント処理順に関しては [hosomichi 様の記事](https://qiita.com/hosomichi/items/49500fea5fdf43f59c58) にて丁寧に解説されています)

逆にツリー内の要素のどこかで `stopPropagation` とかしてるとうまく動かないので、その場合はうまいこと対処してください。

## 関連情報、参考にした記事

- [https://stackoverflow.com/questions/27149192/no-possibility-to-select-text-inside-input-when-parent-is-draggable](https://stackoverflow.com/questions/27149192/no-possibility-to-select-text-inside-input-when-parent-is-draggable)

- [https://github.com/react-dnd/react-dnd/issues/463](https://github.com/react-dnd/react-dnd/issues/463)

- [https://qiita.com/hosomichi/items/49500fea5fdf43f59c58](https://qiita.com/hosomichi/items/49500fea5fdf43f59c58)