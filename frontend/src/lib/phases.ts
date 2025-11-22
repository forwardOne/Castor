export const phaseLists = [
  "default", "1_Recon_Enumeration", "2_Vulnerability_Identification",
  "3_Exploitation_Preparation", "4_Exploitation", "5_Initial_Foothold",
  "6_Privilege_Escalation", "7_Flag_Capture"
];

export const phaseDescriptions: { [key: string]: string } = {
  "default": "特定のフェーズに限定せず抽象的な質問を行うセッション。",
  "1_Recon_Enumeration": "偵察と列挙。ターゲットのシステム、ネットワーク、人員に関する情報を能動的および受動的に収集します。",
  "2_Vulnerability_Identification": "脆弱性の特定。収集した情報に基づいて、システムやアプリケーションに存在する既知および未知の脆弱性を特定します。",
  "3_Exploitation_Preparation": "エクスプロイトの準備。特定した脆弱性を利用するためのツールやペイロードを準備・設定します。",
  "4_Exploitation": "エクスプロイト実行/侵害。準備したエクスプロイトを実行し、システムを侵害する主要な行為を試みます",
  "5_Initial_Foothold": "初期侵入と足がかりの確立。脆弱性を利用して、ターゲットシステムへの最初のアクセスを獲得します。",
  "6_Privilege_Escalation": "権限昇格。初期アクセスから、より高い権限（例：管理者権限）を持つアカウントへのアクセスを試みます。",
  "7_Flag_Capture": "フラグの獲得。最終目的であるフラグ（特定の情報やファイル）を奪取または特定します。",
};
