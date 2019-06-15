---
date: "2019-05-11T01:52:10Z"
version: 1
title: "フォームの入力情報を自動保存&復元するJSライブラリをつくってみた"
tags: ["javascript"]
---

GW(10連休)に何かしてみよう的なノリで作ってみました。

## つくったもの

フォームに情報入力中に操作を中断した際、画面をリロードしても直前の内容を復元できるライブラリ

GitHubプロジェクト  
[https://github.com/nishimura-yuki/form-input-recover](https://github.com/nishimura-yuki/form-input-recover)

#### 特徴

* 入力内容をlocalstorageに適宜保存(ただしpasswordは除く)
* 復元時には復元確認モーダルを挟むか、localstorageにデータがあれば画面リロード時に自動的に復元のどちらかの挙動を選べる
* localstorageには平文で情報を記録せず、復号可能な形式で暗号化をして情報を記録
* 復元のタイミングや確認用のUIを独自に用意したい場合は入力内容の保存、復元、削除を提供するAPIのみを利用することも可
* ライブラリは簡単に利用できるようにCDN(AWS CloudFront & S3)に設置

## 利用デモ

以下の画面のフォームに情報を入力した後、画面リロードすると復元処理が走ります。
#### モーダル付き
[https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-modal.html?lang=ja](https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-modal.html?lang=ja)
#### 自動復元
[https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-auto.html](https://d2t1zo1tr7sobn.cloudfront.net/latest/sample-auto.html)

## 技術的な要素

1. フォームのデータ監視はjQueryを利用
    input, select textarea要素の `change` `keyup` イベントを拾い
    裏側でデータをlocalstorageに記録するシンプルな仕組み
2. ライブラリ側で提供している確認用モーダルの装飾には [emotion](https://emotion.sh/docs/introduction) を利用
    これによりJSの読み込みだけでモーダル(UI)も提供可能に
3. [Travis CI](https://travis-ci.com/nishimura-yuki/form-input-recover)上でテストコードの実行とS3へのアップロードを実施
    Publicなプロジェクトなため遠慮なくTravis CIを使わせていただきました。
    ただ、S3へのアップロードをするにあたりS3側設定でいくつかハマったのでこれは別途記事化しようと思います。

## やってみて思ったこと

オープンソースとしてライブラリを作るとかしたことなかったのでよい機会になりました。
CI, CDNとの連携などがサクッとできたので昨今のWeb開発は周辺環境が恵まれていて嬉しいなとあらためて感じました 😊