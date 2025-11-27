// frontend/src/tests/ChatMessageBubble.test.tsx

/**
 * @fileoverview ChatMessageBubble コンポーネントのテストスイート。
 * ChatMessageBubble は、ユーザーからのメッセージとAIからのレスポンスを個別に表示し、
 * それぞれのロールに応じたスタイルが正しく適用されていることを検証します。
 *
 * @remarks
 * @testing-library/react を使用してコンポーネントをレンダリングし、
 * vitest のアサーションAPIを使用して挙動を検証します。
 * スタイルの検証には、DOM要素に特定のクラスが存在するかを確認しています。
 */

// 必要なテストユーティリティとアサーションAPIをインポートします。
import { render, screen } from '@testing-library/react'; // コンポーネントのレンダリングとDOMへのアクセスを提供
import { expect, describe, it } from 'vitest'; // テストのグループ化とアサーションのためのVitest API

// テスト対象のコンポーネントと、メッセージの役割を定義する型をインポートします。
import { ChatMessageBubble } from '@/components/chat-history'; // テスト対象のChatMessageBubbleコンポーネント
import { MessageRole } from '@/types/types'; // メッセージの役割 (USER, MODELなど) を定義したEnum

/**
 * ChatMessageBubble コンポーネントのテストスイートを定義します。
 * 'describe' ブロック内で関連するテストをグループ化します。
 */
describe('ChatMessageBubble Component', () => {

  /**
   * ユーザーのメッセージが正しく表示され、右寄せスタイルが適用されることを検証するテストケース。
   *
   * 1. ダミーのユーザーメッセージデータを作成します。
   *    - `userMessageContent`: 表示されるテキスト内容。
   *    - `userMessage`: `Message` 型に準拠したオブジェクトで、`id`, `role` (USER), `parts` を含みます。
   * 2. `ChatMessageBubble` コンポーネントを `render` 関数でレンダリングします。
   * 3. `screen.getByText` を使用して、画面上にユーザーメッセージの内容が表示されていることを確認します。
   * 4. メッセージテキスト要素から親要素を辿り、Flexboxの右寄せ(`justify-end`)クラスが適用されているか検証します。
   *    - `closest('div')` で `ReactMarkdown` を囲む `div` を取得します。
   *    - `.parentElement` でそのさらに親の `div` (Flexコンテナ) を取得し、スタイルが適用されていることを確認します。
   */
  it('ユーザーのメッセージが正しく表示され、右寄せスタイルが適用されること', () => {
    const userMessageContent = 'nmapの結果を解析して。';
    const userMessage = {
      id: '1',
      role: MessageRole.USER, // ユーザーの役割を設定
      parts: [{ text: userMessageContent }], // メッセージの内容
    };

    // ChatMessageBubbleコンポーネントを、作成したユーザーメッセージをプロップとして渡してレンダリングします。
    render(<ChatMessageBubble message={userMessage} />);

    // 画面上にユーザーメッセージのテキストが表示されていることを確認します。
    expect(screen.getByText(userMessageContent)).toBeInTheDocument();

    // メッセージテキストを含む要素の親要素を取得し、それが右寄せクラスを持っているか検証します。
    // closest('div')でテキストを囲む最も近いdivを取得し、その親(parentElement)にスタイルが付与されているため、それを検証します。
    const containerElement = screen.getByText(userMessageContent).closest('div')?.parentElement;
    expect(containerElement).toHaveClass('justify-end'); // Flexboxの右寄せクラス
  });

  /**
   * AIからのレスポンスが正しく表示され、左寄せスタイルが適用されることを検証するテストケース。
   *
   * 1. ダミーのAIメッセージデータを作成します。
   *    - `aiMessageContent`: 表示されるテキスト内容。
   *    - `aiMessage`: `Message` 型に準拠したオブジェクトで、`id`, `role` (MODEL), `parts` を含みます。
   * 2. `ChatMessageBubble` コンポーネントを `render` 関数でレンダリングします。
   * 3. `screen.getByText` を使用して、画面上にAIメッセージの内容が表示されていることを確認します。
   * 4. メッセージテキスト要素から親要素を辿り、Flexboxの左寄せ(`justify-start`)クラスが適用されているか検証します。
   *    - ユーザーメッセージのテストと同様に、`.closest('div')?.parentElement` を使用します。
   */
  it('AIからのレスポンスが正しく表示され、左寄せスタイルが適用されること', () => {
    const aiMessageContent = 'nmapの結果を解析しました。開いているポートは...';
    const aiMessage = {
      id: '2',
      role: MessageRole.MODEL, // AI (モデル) の役割を設定
      parts: [{ text: aiMessageContent }], // メッセージの内容
    };

    // ChatMessageBubbleコンポーネントを、作成したAIメッセージをプロップとして渡してレンダリングします。
    render(<ChatMessageBubble message={aiMessage} />);

    // 画面上にAIメッセージのテキストが表示されていることを確認します。
    expect(screen.getByText(aiMessageContent)).toBeInTheDocument();

    // メッセージテキストを含む要素の親要素を取得し、それが左寄せクラスを持っているか検証します。
    const containerElement = screen.getByText(aiMessageContent).closest('div')?.parentElement;
    expect(containerElement).toHaveClass('justify-start'); // Flexboxの左寄せクラス
  });
});