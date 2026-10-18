/* ========================================================
   WORM ARENA - Internationalization & Localization (i18n)
   Default / Primary Language: English ('en')
   Supported: English ('en'), Turkish ('tr')
   ======================================================== */

(function(window) {
  'use strict';

  const TRANSLATIONS = {
    en: {
      // General & Metadata
      app_title: "Worm Arena - Snake & Worm Battle",
      app_desc: "A thrilling and colorful modern multiplayer snake and worm arena battle.",

      // Splash Screen
      splash_title: "WORM ARENA",
      splash_subtitle: "✨ Colorful Worms World! 🍭",
      splash_loading_status: "🍬 Collecting sweet treats...",

      // Toasts & In-Game Alerts
      toast_congrats: "CONGRATULATIONS!",
      toast_levelup: "Reached Level {level}! +{coins} Coins Earned!",
      alert_title_notice: "NOTIFICATION",
      alert_title_success: "SUCCESS",
      alert_title_warning: "WARNING",
      alert_title_info: "INFO",
      arena_wall: "Arena Wall",
      alert_name_required_title: "⚠️ NAME REQUIRED",
      alert_name_required_msg: "Please enter your player name before starting the game!",
      alert_locked_skin_title: "🔒 LOCKED SKIN",
      alert_locked_skin_msg: "This skin unlocks at Level {level}! Please select an unlocked skin.",
      alert_game_started_title: "🎮 GAME STARTED",
      alert_game_started_msg: "🚀 Arena Started! Survive & Dominate!",
      alert_game_good_luck: "🚀 Game Started! Good luck!",
      alert_star_food_transform_title: "⭐ STAR FOOD CONVERSION",
      alert_star_food_transform_msg: "💥 Crashed into {killer}! Your worm turned into {count} Star Foods! ⭐",
      alert_level_up_title: "🎉 LEVEL UP!",
      alert_level_up_msg: "Reached Level {level}! +{coins} Coins added to your account!",
      alert_wheel_daily_limit_title: "⏳ DAILY LIMIT",
      alert_wheel_daily_limit_msg: "You can only spin once a day! Come back tomorrow.",
      alert_insufficient_coins_title: "⚠️ NOT ENOUGH COINS",
      alert_insufficient_coins_msg: "Not enough coins! Collect fruits in the arena or spin the wheel to earn coins.",
      alert_skin_insufficient_coins_msg: "You do not have enough coins to purchase this skin!",
      alert_level_required_title: "🔒 LEVEL REQUIRED",
      alert_level_required_msg: "You must reach Level {level} to unlock this skin!",
      alert_milestone_claim_title: "🎁 LEGENDARY MILESTONE REWARD",
      alert_milestone_claim_msg: "🎉 CONGRATULATIONS! Day {day} Grand Milestone Reward ({reward}) has been added to your account!",
      alert_quest_claim_title: "🪙 QUEST REWARD",
      alert_quest_claim_msg: "🎉 Quest Completed! +{reward} Coins Earned!",
      alert_code_copied_title: "📋 CODE COPIED",
      alert_code_copied_msg: "Room code copied to clipboard: {code}",
      alert_code_preparing: "Room code is being generated, please wait...",
      alert_link_copied_title: "🔗 LINK COPIED",
      alert_link_copied_msg: "Room link copied to clipboard!",
      alert_left_room_title: "🚪 LEFT ROOM",
      alert_left_room_msg: "You left the room.",
      alert_respawn_requested_title: "🔄 RESPAWN",
      alert_respawn_requested_msg: "Respawn request sent...",
      alert_connecting_room_title: "🎮 JOINING ROOM",
      alert_connecting_room_msg: "Connecting to room #{code}...",
      alert_conn_error_title: "⚠️ CONNECTION ERROR",
      alert_conn_error_msg: "Multiplayer network library could not be loaded. Please check your internet connection.",
      alert_conn_timeout_title: "⚠️ CONNECTION TIMEOUT",
      alert_conn_timeout_msg: "Could not reach host. Please verify the host has the game open and room active, then click 'Reconnect'.",
      alert_conn_lost_title: "⚠️ CONNECTION LOST",
      alert_conn_lost_msg: "Room connection lost. Returning to menu...",

      // Fortune Wheel specific
      wheel_limit_btn: "TODAY'S CHANCE USED",
      wheel_limit_msg: "⏳ You can only spin the wheel once a day. Come back tomorrow!",
      wheel_badge_tomorrow: "Tomorrow",
      wheel_badge_free: "Free",

      // Event Banner
      event_gold_rain: "A HUGE GOLD RAIN HAS STARTED IN THE CENTER!",

      // HUD
      hud_leaderboard: "LEADERBOARD",
      target_score_badge: "🎯 GOAL: 20K",
      hud_powerup_magnet: "MAGNET",
      hud_powerup_ghost: "GHOST",
      hud_powerup_double: "2X POINTS",
      hud_btn_boost: "BOOST",
      hud_you_tag: "(You)",
      hud_exit_title: "Return to Main Menu",
      hud_sound_title: "Sound",

      // Main Menu
      menu_legend_badge: "👑 LEGEND",
      menu_title: "WORM ARENA",
      menu_subtitle: "🌈 Colorful Worms Battle! 🍭",
      menu_shortcut_wheel: "Fortune Wheel",
      menu_shortcut_wheel_badge: "Free",
      menu_shortcut_shop: "Shop",
      menu_shortcut_quests: "Quests",
      menu_shortcut_quests_badge: "New",
      menu_shortcut_settings: "Settings",
      menu_name_placeholder: "✍️ Super Snake Name...",
      menu_play_btn: "🎮 PLAY ▶",
      menu_friends_btn: "Play with Friends (Room)",
      menu_tip_badge: "TIP",
      menu_tip_text: "Collect 🧲 Magnets in the arena to vacuum all surrounding gold!",
      menu_sound_btn_title: "Toggle Sound",
      menu_settings_btn_title: "Settings",
      skin_unlock_level: "Unlocks at Level {level}",
      head_costume_label: "Head Costume: {name}",
      head_original: "Original",

      // Multiplayer Modal
      mp_modal_title: "PLAY WITH FRIENDS",
      mp_modal_desc: "Gather with friends in the same arena and start the battle together!",
      mp_tab_create: "👑 Create Room",
      mp_tab_join: "🎮 Join Room",
      mp_code_label: "YOUR 4-DIGIT ROOM CODE:",
      mp_code_loading: "Loading...",
      mp_copy_code_btn: "📋 Copy Code",
      mp_code_copied: "✓ Copied!",
      mp_link_label: "🔗 WEB LINK TO SHARE WITH FRIENDS:",
      mp_link_placeholder: "Preparing room link...",
      mp_share_btn: "📤 Share",
      mp_code_tip: "✨ When your friends click this link, they will join your room directly from the browser!",
      mp_lobby_title: "👥 Ready Players ({count}):",
      mp_lobby_status_active: "🟢 Lobby Active",
      mp_lobby_status_open: "🟢 Lobby Open",
      mp_lobby_status_connecting: "🟡 Connecting...",
      mp_lobby_status_retry: "⚠️ Try Again",
      mp_lobby_host_name: "You (Room Host)",
      mp_badge_leader: "LEADER",
      mp_badge_ready: "READY",
      mp_badge_connecting: "CONNECTING",
      mp_bots_toggle: "Include Bots in Arena",
      mp_start_btn: "START GAME 🚀",
      mp_start_btn_count: "START GAME (Start with {count} Players) 🚀",
      mp_host_hint: "💡 When you click 'Start Game', all players in the room will begin the game simultaneously.",

      // Multiplayer Join Tab
      mp_join_name_label: "👤 Your Player Name:",
      mp_join_name_placeholder: "Enter your name (e.g. Shadow_X)",
      mp_join_code_label: "🔢 Enter 4-Digit Room Code:",
      mp_join_code_placeholder: "e.g. 7842",
      mp_join_submit_btn: "JOIN ROOM & PLAY 🎮",
      mp_join_tip: "⏳ Once connected, your friends will be listed in the waiting room and the game will start automatically when the host launches the arena.",
      mp_err_name_required: "⚠️ Please enter your player name! Cannot join without a name.",
      mp_err_code_required: "⚠️ Please enter the 4-digit room code!",

      // Multiplayer Waiting Tab (Client)
      mp_waiting_room_label: "ROOM CODE",
      mp_waiting_status_text: "Host hasn't started the game yet. Please wait...",
      mp_waiting_badge: "⏳ Waiting to Start",
      mp_waiting_host_name: "Room Host",
      mp_waiting_owner_notice: "Host hasn't started the game yet. Please wait...",
      mp_waiting_notice_text: "Your game will begin automatically as soon as the host clicks 'Start Game'. Please wait without leaving!",
      mp_retry_btn: "🔄 RECONNECT",
      mp_leave_btn: "🚪 Leave Room",
      mp_connecting_to_host: "Connecting to room host...",
      mp_searching_host: "Searching for host, please wait...",

      // Invite Name Modal
      invite_modal_title: "🎮 YOU'VE BEEN INVITED TO A ROOM",
      invite_room_label: "Room Code:",
      invite_desc: "Please <strong>enter your name</strong> so your friends can see you in the game and lobby:",
      invite_name_label: "👤 PLAYER NAME (Required):",
      invite_name_placeholder: "Type your name here...",
      invite_btn: "JOIN ROOM 🚀",

      // Fortune Wheel Modal
      wheel_title: "🎡 DAILY FORTUNE WHEEL",
      wheel_desc: "Spin the wheel, grab huge coin rewards and mystery costumes!",
      wheel_win_msg: "🎉 Congratulations! You won {reward}!",
      wheel_spin_btn: "TRY YOUR LUCK (FREE)",

      // Shop Modal
      shop_title: "🛒 SHOP",
      shop_tab_hats: "👑 Hats",
      shop_tab_skins: "🎨 Skins",
      shop_item_free: "Free",
      shop_btn_equipped: "✓ EQUIPPED",
      shop_btn_equip: "EQUIP",
      shop_btn_buy: "BUY",
      shop_btn_selected: "✓ SELECTED",
      shop_btn_locked: "🔒 LOCKED",
      shop_btn_select: "SELECT",
      shop_unlock_level: "Unlocks at Lv.{level}",

      // Quests & Milestones Modal
      quests_modal_title: "📜 QUESTS & REWARDS",
      streak_title: "🎁 DAILY LOYALTY & LEGENDARY REWARD JOURNEY",
      streak_login_badge: "📅 Login: Day {day}",
      streak_total_login: "📅 Total Logins: Day {day}",
      streak_subtitle: "Grow in the arena every day and pass the milestones; win massive coins, legendary skins, and headpieces on days 7, 15, 30, 60, 90, 120+!",
      streak_btn_claimed: "✓ CLAIMED",
      streak_btn_claim: "🎁 CLAIM REWARD",
      streak_claim_tooltip: "Tap to claim your reward!",
      quests_header: "Daily Extra Quests",
      quest_btn_claimed: "CLAIMED",
      quest_btn_claim: "CLAIM REWARD",
      quest_coins_reward: "+{coins} 🪙 Coins",

      // Settings Modal
      settings_title: "GAME SETTINGS",
      settings_sec_lang: "🌐 LANGUAGE / DİL",
      settings_lang_name: "🌐 Game Language",
      settings_lang_desc: "Choose English or Turkish / Dil seçin",
      settings_lang_opt_en: "English (Default)",
      settings_lang_opt_tr: "Türkçe",
      settings_sec_sound: "🔊 SOUND & FEEDBACK",
      settings_sfx_name: "🔊 Sound Effects",
      settings_sfx_desc: "Food, collision, and boost sounds",
      settings_music_name: "🎵 Background Music",
      settings_music_desc: "Retro synthwave music",
      settings_vibrate_name: "📳 Vibration (Haptic)",
      settings_vibrate_desc: "Vibration on collisions and foods",
      settings_sec_controls: "🎮 CONTROLS & GAMEPLAY",
      settings_control_name: "🕹️ Control Mode",
      settings_control_desc: "How would you like to steer the snake?",
      settings_opt_ctrl_dynamic: "Dynamic Joystick",
      settings_opt_ctrl_direct: "Direct Touch / Follow",
      settings_opt_ctrl_fixed: "Fixed Analog Stick",
      settings_boost_pos_name: "🚀 Boost Button Placement",
      settings_boost_pos_desc: "Position of the turbo boost button",
      settings_opt_pos_right: "Bottom Right (Default)",
      settings_opt_pos_left: "Bottom Left",
      settings_sec_display: "👁️ DISPLAY & PERFORMANCE",
      settings_minimap_name: "🗺️ Mini-Map (Radar)",
      settings_minimap_desc: "Arena radar in bottom-right corner",
      settings_camera_name: "🔍 Camera View Distance",
      settings_camera_desc: "Bird's-eye view zoom distance",
      settings_opt_cam_normal: "Normal View",
      settings_opt_cam_wide: "Wide Angle (Bird's Eye)",
      settings_fps_name: "⚡ 60 FPS Graphics Mode",
      settings_fps_desc: "High-quality neon glow lighting",
      settings_reset_btn: "⚠️ Reset All Game Data",
      settings_confirm_reset: "All your progress, unlocked badges, and coins will be reset. Are you sure?",

      // Exit Confirm Modal
      exit_modal_title: "EXIT ARENA?",
      exit_modal_desc: "All collected score will be saved. Return to main menu? 😊",
      exit_btn_yes: "Yes, Exit",
      exit_btn_no: "No, Keep Playing! 🎮",

      // Game Over Screen
      gameover_title: "SQUASHED!",
      gameover_killed_by: "You crashed into {killer}! 🍭",
      an_obstacle: "an obstacle",
      stat_coins_label: "Earned Coins",
      stat_kills_label: "Defeated Bots",
      stat_score_label: "Total Score",
      stat_rank_label: "Highest Rank",
      gameover_respawn_btn: "🔄 PLAY AGAIN / RESPAWN",
      gameover_return_menu_btn: "🚪 Return to Main Menu ✨",

      // Victory Screen (20K Points Win)
      victory_title: "ARENA CHAMPION!",
      victory_subtitle: "You reached 20,000 points and conquered the arena! Glorious victory! 🎉",
      victory_match_finished: "MATCH FINISHED!",
      victory_winner_other: "{winner} reached 20,000 points and won the game!",
      stat_winner_label: "Winner",
      stat_bonus_label: "Champion Bonus",

      // Network / Status
      net_connecting: "Connecting to host...",
      net_trying_reach: "Trying to reach host ({attempt}/{max})...",
      net_waiting_return: "Waiting for host to return ({attempt}/{max})... Please wait",
      net_timeout_msg: "Could not reach host. Please verify the host has the game open and room active, then click 'Reconnect'.",
      net_timeout_title: "⚠️ CONNECTION TIMEOUT",
      net_lost_msg: "Room connection lost. Returning to menu...",
      net_lost_title: "⚠️ CONNECTION LOST",
      net_lib_err: "Multiplayer network library could not be loaded. Please check your internet connection.",
      net_conn_failed_msg: "Could not connect to room. Please check your internet connection.",
      net_peer_unavailable_msg: "Room host for \"{code}\" is not ready yet. Please ensure the host has the game and room open.",
      net_waiting_host_title: "⚠️ WAITING FOR HOST",
      net_conn_err_retry: "Error occurred while connecting to room host. Please try again.",
      player_default: "Player",
      you: "You"
    },

    tr: {
      // General & Metadata
      app_title: "Worm Arena - Solucan & Yılan Savaşı",
      app_desc: "Mobil cihazlar ve web için özel olarak tasarlanmış modern solucan ve yılan arenası savaşı.",

      // Splash Screen
      splash_title: "WORM ARENA",
      splash_subtitle: "✨ Renkli Solucanlar Dünyası! 🍭",
      splash_loading_status: "🍬 Renkli şekerler toplanıyor...",

      // Toasts & In-Game Alerts
      toast_congrats: "TEBRİKLER!",
      toast_levelup: "Seviye {level} oldun! +{coins} Altın Kazandın!",
      alert_title_notice: "BİLDİRİM",
      alert_title_success: "BAŞARILI",
      alert_title_warning: "DİKKAT",
      alert_title_info: "BİLGİ",
      arena_wall: "Arena Duvarı",
      alert_name_required_title: "⚠️ İSİM GEREKLİ",
      alert_name_required_msg: "Lütfen oyuna başlamadan önce oyuncu adınızı giriniz!",
      alert_locked_skin_title: "🔒 KİLİTLİ KOSTÜM",
      alert_locked_skin_msg: "Bu kostüm Seviye {level}'de açılır! Lütfen seviyenize uygun bir kostüm seçin.",
      alert_game_started_title: "🎮 OYUN BAŞLADI",
      alert_game_started_msg: "🚀 Arena Başlatıldı! Hayatta Kal!",
      alert_game_good_luck: "🚀 Oyun Başladı! İyi Şanslar!",
      alert_star_food_transform_title: "⭐ YILDIZLI YEMEK DÖNÜŞÜMÜ",
      alert_star_food_transform_msg: "💥 {killer} ile çarpıştın! Yılanın {count} adet Yıldızlı Yemeğe Dönüştü! ⭐",
      alert_level_up_title: "🎉 SEVİYE ATLADIN!",
      alert_level_up_msg: "Seviye {level} oldun! Hesabına +{coins} Altın eklendi!",
      alert_wheel_daily_limit_title: "⏳ GÜNLÜK HAK",
      alert_wheel_daily_limit_msg: "Çarkı günde sadece 1 kez çevirebilirsin! Yarın tekrar gel.",
      alert_insufficient_coins_title: "⚠️ YETERSİZ ALTIN",
      alert_insufficient_coins_msg: "Yetersiz altın! Arenada meyve toplayarak veya çarkı çevirerek altın kazanabilirsin.",
      alert_skin_insufficient_coins_msg: "Bu kostümü almak için yeterli altının yok!",
      alert_level_required_title: "🔒 SEVİYE GEREKLİ",
      alert_level_required_msg: "Bu kostümü açmak için Seviye {level} olmalısın!",
      alert_milestone_claim_title: "🎁 EFSANEVİ AŞAMA ÖDÜLÜ",
      alert_milestone_claim_msg: "🎉 TEBRİKLER! {day}. Gün Büyük Aşama Ödülü ({reward}) Hesabına Eklendi!",
      alert_quest_claim_title: "🪙 GÖREV ÖDÜLÜ",
      alert_quest_claim_msg: "🎉 Görev Tamamlandı! +{reward} Altın Kazandın!",
      alert_code_copied_title: "📋 KOD KOPYALANDI",
      alert_code_copied_msg: "Oda kodu panoya kopyalandı: {code}",
      alert_code_preparing: "Oda kodu hazırlanıyor, lütfen bekleyin...",
      alert_link_copied_title: "🔗 LİNK KOPYALANDI",
      alert_link_copied_msg: "Oda linki panoya kopyalandı!",
      alert_left_room_title: "🚪 AYRILINDI",
      alert_left_room_msg: "Odadan ayrıldınız.",
      alert_respawn_requested_title: "🔄 CANLANMA",
      alert_respawn_requested_msg: "Yeniden canlanma isteği gönderildi...",
      alert_connecting_room_title: "🎮 ODAYA KATIL",
      alert_connecting_room_msg: "{code} numaralı odaya bağlanılıyor...",
      alert_conn_error_title: "⚠️ BAĞLANTI HATASI",
      alert_conn_error_msg: "Çok oyunculu ağ kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.",
      alert_conn_timeout_title: "⚠️ BAĞLANTI ZAMAN AŞIMI",
      alert_conn_timeout_msg: "Oda sahibine ulaşılamadı. Oda sahibinin telefonunda oyunun açık ve odanın kurulu olduğundan emin olup 'Tekrar Bağlan' butonuna basın.",
      alert_conn_lost_title: "⚠️ BAĞLANTI KOPTU",
      alert_conn_lost_msg: "Oda bağlantısı kesildi. Menüye dönülüyor...",

      // Fortune Wheel specific
      wheel_limit_btn: "BUGÜNKÜ HAKKIN BİTTİ",
      wheel_limit_msg: "⏳ Çarkı günde sadece 1 kez çevirebilirsin. Yarın tekrar gel!",
      wheel_badge_tomorrow: "Yarın",
      wheel_badge_free: "Ücretsiz",

      // Event Banner
      event_gold_rain: "MERKEZDE BÜYÜK ALTIN YAĞMURU BAŞLADI!",

      // HUD
      hud_leaderboard: "LİDERLİK",
      target_score_badge: "🎯 HEDEF: 20K",
      hud_powerup_magnet: "MIKNATIS",
      hud_powerup_ghost: "HAYALET",
      hud_powerup_double: "2X PUAN",
      hud_btn_boost: "HIZLAN",
      hud_you_tag: "(Sen)",
      hud_exit_title: "Ana Menüye Dön",
      hud_sound_title: "Ses",

      // Main Menu
      menu_legend_badge: "👑 EFSANE",
      menu_title: "WORM ARENA",
      menu_subtitle: "🌈 Renkli Solucanlar Savaşı! 🍭",
      menu_shortcut_wheel: "Şans Çarkı",
      menu_shortcut_wheel_badge: "Ücretsiz",
      menu_shortcut_shop: "Mağaza",
      menu_shortcut_quests: "Görevler",
      menu_shortcut_quests_badge: "Yeni",
      menu_shortcut_settings: "Ayarlar",
      menu_name_placeholder: "✍️ Süper Yılan Adın...",
      menu_play_btn: "🎮 OYNA ▶",
      menu_friends_btn: "Arkadaşlarla Oyna (Oda)",
      menu_tip_badge: "İPUCU",
      menu_tip_text: "Arenadaki 🧲 Mıknatısları toplayarak çevrendeki tüm altınları vakumla!",
      menu_sound_btn_title: "Ses Aç/Kapat",
      menu_settings_btn_title: "Ayarlar",
      skin_unlock_level: "Seviye {level}'de Açılır",
      head_costume_label: "Baş Kostümü: {name}",
      head_original: "Orijinal",

      // Multiplayer Modal
      mp_modal_title: "ARKADAŞLARLA OYNA",
      mp_modal_desc: "Arkadaşlarınla aynı arenada toplan ve aynı anda savaşa başla!",
      mp_tab_create: "👑 Oda Kur",
      mp_tab_join: "🎮 Odaya Katıl",
      mp_code_label: "SENİN 4 HANELİ ODA KODUN:",
      mp_code_loading: "Yükleniyor...",
      mp_copy_code_btn: "📋 Kodu Kopyala",
      mp_code_copied: "✓ Kopyalandı!",
      mp_link_label: "🔗 ARKADAŞINA GÖNDERECEĞİN WEB LİNKİ:",
      mp_link_placeholder: "Oda linki hazırlanıyor...",
      mp_share_btn: "📤 Paylaş",
      mp_code_tip: "✨ Arkadaşların bu linke tıkladığında doğrudan tarayıcıdan odana katılır ve beklemeye geçer!",
      mp_lobby_title: "👥 Hazır Olan Oyuncular ({count}):",
      mp_lobby_status_active: "🟢 Lobi Aktif",
      mp_lobby_status_open: "🟢 Lobi Açık",
      mp_lobby_status_connecting: "🟡 Bağlanıyor...",
      mp_lobby_status_retry: "⚠️ Tekrar Dene",
      mp_lobby_host_name: "Sen (Oda Sahibi)",
      mp_badge_leader: "LİDER",
      mp_badge_ready: "HAZIR",
      mp_badge_connecting: "BAĞLANIYOR",
      mp_bots_toggle: "Arenada Botlar da Olsun",
      mp_start_btn: "OYUNU BAŞLAT 🚀",
      mp_start_btn_count: "OYUNU BAŞLAT ({count} Oyuncuyla Başla) 🚀",
      mp_host_hint: "💡 'Oyunu Başlat' butonuna bastığında odadaki bütün oyuncular aynı anda oyuna başlayacaktır.",

      // Multiplayer Join Tab
      mp_join_name_label: "👤 Oyuncu Adın:",
      mp_join_name_placeholder: "Adını yaz (Örn: Kaplan_TR)",
      mp_join_code_label: "🔢 4 Haneli Oda Kodunu Gir:",
      mp_join_code_placeholder: "Örn: 7842",
      mp_join_submit_btn: "ODAYA BAĞLAN & OYNA 🎮",
      mp_join_tip: "⏳ Odaya bağlandığında bekleme odasında arkadaşların listelenecek ve oda sahibi arenayı başlattığında oyun otomatik olarak başlayacaktır.",
      mp_err_name_required: "⚠️ Lütfen oyuncu adınızı girin! İsimsiz odaya katılamazsınız.",
      mp_err_code_required: "⚠️ Lütfen 4 haneli oda kodunu girin!",

      // Multiplayer Waiting Tab (Client)
      mp_waiting_room_label: "ODA KODU",
      mp_waiting_status_text: "Oda sahibi henüz oyunu başlatmadı. Lütfen bekleyin...",
      mp_waiting_badge: "⏳ Başlama Bekleniyor",
      mp_waiting_host_name: "Oda Sahibi",
      mp_waiting_owner_notice: "Oda sahibi henüz oyunu başlatmadı. Lütfen bekleyin...",
      mp_waiting_notice_text: "Oda sahibi \"Oyunu Başlat\" butonuna bastığı an oyununuz otomatik olarak başlayacaktır. Lütfen ayrılmadan bekleyin!",
      mp_retry_btn: "🔄 TEKRAR BAĞLAN",
      mp_leave_btn: "🚪 Odadan Ayrıl",
      mp_connecting_to_host: "Oda sahibine bağlanılıyor...",
      mp_searching_host: "Oda sahibi aranıyor, lütfen bekleyin...",

      // Invite Name Modal
      invite_modal_title: "🎮 ODAYA DAVET EDİLDİN",
      invite_room_label: "Katılacağın Oda Kodu:",
      invite_desc: "Arkadaşlarının seni oyunda ve lobide görebilmesi için <strong>lütfen adını gir</strong>:",
      invite_name_label: "👤 OYUNCU ADIN (Zorunlu):",
      invite_name_placeholder: "Adını buraya yaz...",
      invite_btn: "ODAYA KATIL 🚀",

      // Fortune Wheel Modal
      wheel_title: "🎡 GÜNLÜK ŞANS ÇARKI",
      wheel_desc: "Çarkı çevir, devasa altın ödülleri ve gizemli kostümleri kap!",
      wheel_win_msg: "🎉 Tebrikler! {reward} Kazandın!",
      wheel_spin_btn: "ŞANSINI DENE (ÜCRETSİZ)",

      // Shop Modal
      shop_title: "🛒 MAĞAZA",
      shop_tab_hats: "👑 Şapkalar",
      shop_tab_skins: "🎨 Kostümler",
      shop_item_free: "Ücretsiz",
      shop_btn_equipped: "✓ KUŞANILDI",
      shop_btn_equip: "KUŞAN",
      shop_btn_buy: "SATIN AL",
      shop_btn_selected: "✓ SEÇİLDİ",
      shop_btn_locked: "🔒 KİLİTLİ",
      shop_btn_select: "SEÇ",
      shop_unlock_level: "Lv.{level}'de Açılır",

      // Quests & Milestones Modal
      quests_modal_title: "📜 GÖREVLER & ÖDÜLLER",
      streak_title: "🎁 GÜNLÜK SADAKAT & EFSANEVİ ÖDÜL YOLCULUĞU",
      streak_login_badge: "📅 Giriş: {day}. Gün",
      streak_total_login: "📅 Toplam Giriş: {day}. Gün",
      streak_subtitle: "Her gün arenada büyü ve günleri devir; 7, 15, 30, 60, 90, 120. günlerde devasa altınlar, efsanevi kostümler ve başlıklar kazan!",
      streak_btn_claimed: "✓ ALINDI",
      streak_btn_claim: "🎁 ÖDÜLÜ AL",
      streak_claim_tooltip: "Ödülünü almak için dokun!",
      quests_header: "Günlük Ekstra Görevler",
      quest_btn_claimed: "ALINDI",
      quest_btn_claim: "ÖDÜLÜ AL",
      quest_coins_reward: "+{coins} 🪙 Altın",

      // Settings Modal
      settings_title: "OYUN AYARLARI",
      settings_sec_lang: "🌐 DİL / LANGUAGE",
      settings_lang_name: "🌐 Oyun Dili",
      settings_lang_desc: "İngilizce veya Türkçe seçin",
      settings_lang_opt_en: "İngilizce (Varsayılan)",
      settings_lang_opt_tr: "Türkçe",
      settings_sec_sound: "🔊 SES & GERİ BİLDİRİM",
      settings_sfx_name: "🔊 Ses Efektleri",
      settings_sfx_desc: "Yem, çarpışma ve turbo sesleri",
      settings_music_name: "🎵 Fon Müziği",
      settings_music_desc: "Retro synthwave müzik",
      settings_vibrate_name: "📳 Titreşim (Haptik)",
      settings_vibrate_desc: "Çarpışmalarda ve yemlerde titreşim",
      settings_sec_controls: "🎮 KONTROLLER & OYNANIŞ",
      settings_control_name: "🕹️ Kontrol Tipi",
      settings_control_desc: "Yılanı nasıl yönlendirmek istersin?",
      settings_opt_ctrl_dynamic: "Dinamik Joystick",
      settings_opt_ctrl_direct: "Doğrudan Dokunma",
      settings_opt_ctrl_fixed: "Sabit Analog Kol",
      settings_boost_pos_name: "🚀 Turbo Buton Konumu",
      settings_boost_pos_desc: "Hızlanma butonu yerleşimi",
      settings_opt_pos_right: "Sağ Altta (Varsayılan)",
      settings_opt_pos_left: "Sol Altta",
      settings_sec_display: "👁️ GÖRÜNÜM & PERFORMANS",
      settings_minimap_name: "🗺️ Mini Harita (Radar)",
      settings_minimap_desc: "Sağ alt köşede arena radarı",
      settings_camera_name: "🔍 Kamera Görüş Alanı",
      settings_camera_desc: "Kuşbakışı görüş mesafesi",
      settings_opt_cam_normal: "Normal Görüş",
      settings_opt_cam_wide: "Geniş Açı (Kuşbakışı)",
      settings_fps_name: "⚡ 60 FPS Grafik Modu",
      settings_fps_desc: "Yüksek kalite neon ışıkları",
      settings_reset_btn: "⚠️ Tüm Oyun Verilerini Sıfırla",
      settings_confirm_reset: "Tüm ilerlemeniz, kazandığınız rozetler ve altınlarınız sıfırlanacaktır. Emin misiniz?",

      // Exit Confirm Modal
      exit_modal_title: "ARENADAN ÇIK?",
      exit_modal_desc: "Topladığın tüm puanlar kaydedilecek. Ana menüye dönmek istiyor musun? 😊",
      exit_btn_yes: "Evet, Çık",
      exit_btn_no: "Hayır, Devam Et! 🎮",

      // Game Over Screen
      gameover_title: "EZİLDİN!",
      gameover_killed_by: "{killer} adlı solucana çarptın! 🍭",
      an_obstacle: "Bir engele",
      stat_coins_label: "Kazanılan Altın",
      stat_kills_label: "Yok Edilen Bot",
      stat_score_label: "Toplam Puan",
      stat_rank_label: "En Yüksek Sıralama",
      gameover_respawn_btn: "🔄 TEKRAR OYNA / CANLAN",
      gameover_return_menu_btn: "🚪 Ana Menüye Dön ✨",

      // Victory Screen (20K Points Win)
      victory_title: "ARENA ŞAMPİYONU!",
      victory_subtitle: "20.000 puana ulaşarak arenayı fethettin! Harika bir zafer! 🎉",
      victory_match_finished: "MAÇ SONA ERDİ!",
      victory_winner_other: "{winner} 20.000 puana ulaşarak maçı kazandı!",
      stat_winner_label: "Kazanan",
      stat_bonus_label: "Şampiyon Bonusu",

      // Network / Status
      net_connecting: "Oda sahibine bağlanılıyor...",
      net_trying_reach: "Oda sahibine ulaşılmaya çalışılıyor ({attempt}/{max})...",
      net_waiting_return: "Oda sahibinin oyuna dönmesi bekleniyor ({attempt}/{max})... Lütfen bekleyin",
      net_timeout_msg: "Oda sahibine ulaşılamadı. Oda sahibinin telefonunda oyunun açık ve odanın kurulu olduğundan emin olup 'Tekrar Bağlan' butonuna basın.",
      net_timeout_title: "⚠️ BAĞLANTI ZAMAN AŞIMI",
      net_lost_msg: "Oda bağlantısı kesildi. Menüye dönülüyor...",
      net_lost_title: "⚠️ BAĞLANTI KOPTU",
      net_lib_err: "Çok oyunculu ağ kütüphanesi yüklenemedi. İnternet bağlantınızı kontrol edin.",
      net_conn_failed_msg: "Odaya bağlanılamadı. İnternet bağlantınızı kontrol edin.",
      net_peer_unavailable_msg: "\"{code}\" kodlu oda sahibi henüz hazır değil. Oda sahibinin telefonunda oyunun açık olduğundan emin olun.",
      net_waiting_host_title: "⚠️ ODA SAHİBİ BEKLENİYOR",
      net_conn_err_retry: "Oda sahibine bağlanırken hata oluştu. Lütfen tekrar deneyin.",
      player_default: "Oyuncu",
      you: "Sen"
    }
  };

  const SKINS_TRANSLATION = {
    white_king: { en: 'Holy White Dragon', tr: 'Kutsal Ak Ejder' },
    candy_pink: { en: 'Crystal Candy Cobra', tr: 'Kristal Şeker Kobrası' },
    neon_cyber: { en: 'Cyber Mecha Titan', tr: 'Siber Mecha Titan' },
    golden_dragon: { en: 'Imperial Gold Dragon', tr: 'İmparatorluk Altın Ejderi' },
    fire_tiger: { en: 'Magma Fire Serpent', tr: 'Magma Ateş Yılanı' },
    shadow_ninja: { en: 'Shadow Assassin', tr: 'Gölge Suikastçı' },
    samurai_warlord: { en: 'Ancient Samurai Shogun', tr: 'Kadim Samuray Şogunu' },
    dark_galaxy: { en: 'Cosmic Void Dragon', tr: 'Kozmik Hiçlik Ejderi' },
    frozen_frost: { en: 'Glacial Frost Drake', tr: 'Buzul Kırağı Ejderi' }
  };

  const HATS_TRANSLATION = {
    none: { en: 'Original Snake Head', tr: 'Orijinal Yılan Başı' },
    horns: { en: 'Demon Lord Head', tr: 'Şeytan Lordu Başı' },
    ninja: { en: 'Dark Ninja Head', tr: 'Kara Ninja Başı' },
    cat_ears: { en: 'Cyber Cat Head', tr: 'Siber Kedi Başı' },
    cowboy: { en: 'Wild Cowboy Head', tr: 'Vahşi Kovboy Başı' },
    pirate: { en: 'Pirate Captain Head', tr: 'Korsan Kaptan Başı' },
    halo: { en: 'Holy Angel Head', tr: 'Kutsal Melek Başı' },
    skull: { en: 'Cursed Skull', tr: 'Lanetli Kafatası' },
    robot: { en: 'Cyborg Robot Head', tr: 'Sayborg Robot Başı' },
    crown: { en: 'Golden Crown King Head', tr: 'Altın Taçlı Kral Başı' },
    sunglasses: { en: 'Cool Star Head', tr: 'Havalı Yıldız Başı' },
    party_hat: { en: 'Crazy Party Head', tr: 'Çılgın Parti Başı' },
    wizard: { en: 'Ancient Wizard Head', tr: 'Kadim Büyücü Başı' }
  };

  const MILESTONES_TRANSLATION = {
    1: { en: { tag: 'DAY 1', goalText: 'Reach 25 Score', rewardText: '+200 Coins' }, tr: { tag: 'GÜN 1', goalText: '25 Skora Ulaş', rewardText: '+200 Altın' } },
    2: { en: { tag: 'DAY 2', goalText: 'Reach 50 Score', rewardText: 'Cool Star Head' }, tr: { tag: 'GÜN 2', goalText: '50 Skora Ulaş', rewardText: 'Havalı Yıldız Başı' } },
    3: { en: { tag: 'DAY 3', goalText: 'Reach 100 Score', rewardText: '+500 Coins & 80 XP' }, tr: { tag: 'GÜN 3', goalText: '100 Skora Ulaş', rewardText: '+500 Altın & 80 XP' } },
    4: { en: { tag: 'DAY 4', goalText: 'Reach 180 Score', rewardText: 'Wild Cowboy Head' }, tr: { tag: 'GÜN 4', goalText: '180 Skora Ulaş', rewardText: 'Vahşi Kovboy Başı' } },
    5: { en: { tag: 'DAY 5', goalText: 'Reach 300 Score', rewardText: '+1000 Coins & 150 XP' }, tr: { tag: 'GÜN 5', goalText: '300 Skora Ulaş', rewardText: '+1000 Altın & 150 XP' } },
    6: { en: { tag: 'DAY 6', goalText: 'Reach 450 Score', rewardText: 'Dark Ninja Head' }, tr: { tag: 'GÜN 6', goalText: '450 Skora Ulaş', rewardText: 'Kara Ninja Başı' } },
    7: { en: { tag: 'WEEK 1 👑', goalText: 'Reach 600 Score', rewardText: 'Gold Crown Head + 2500🪙' }, tr: { tag: '1. HAFTA 👑', goalText: '600 Skora Ulaş', rewardText: 'Altın Taç Başı + 2500🪙' } },
    15: { en: { tag: 'DAY 15 ⭐', goalText: '800 Master Score', rewardText: 'Demon Lord Head + 3500🪙' }, tr: { tag: '15. GÜN ⭐', goalText: '800 Usta Skor', rewardText: 'Şeytan Lordu Başı + 3500🪙' } },
    30: { en: { tag: 'MONTH 1 🌟', goalText: '1000 Legend Score', rewardText: 'Cyborg Head + Magma Skin + 5000🪙' }, tr: { tag: '1. AY 🌟', goalText: '1000 Efsane Skor', rewardText: 'Sayborg Başı + Magma Kostümü + 5000🪙' } },
    60: { en: { tag: 'MONTH 2 ⭐', goalText: '1300 Ancient Score', rewardText: 'Wizard Head + Shadow Skin + 7500🪙' }, tr: { tag: '2. AY ⭐', goalText: '1300 Kadim Skor', rewardText: 'Büyücü Başı + Gölge Kostümü + 7500🪙' } },
    90: { en: { tag: 'MONTH 3 🏆', goalText: '1600 Champion', rewardText: 'Cursed Head + Samurai + 10,000🪙' }, tr: { tag: '3. AY 🏆', goalText: '1600 Şampiyon', rewardText: 'Lanetli Kafa + Samuray + 10.000🪙' } },
    120: { en: { tag: 'MONTH 4 👑', goalText: '2000 Supreme Lord', rewardText: 'Holy Angel + Void Dragon + 15,000🪙' }, tr: { tag: '4. AY 👑', goalText: '2000 Yüce Efendi', rewardText: 'Kutsal Melek + Hiçlik Ejderi + 15.000🪙' } },
    150: { en: { tag: 'MONTH 5 🚀', goalText: '2400 Cosmic Titan', rewardText: 'Cyber Cat + 20,000🪙' }, tr: { tag: '5. AY 🚀', goalText: '2400 Kozmik Titan', rewardText: 'Siber Kedi + 20.000🪙' } },
    180: { en: { tag: 'MONTH 6 👑', goalText: '3000 Peak Legend', rewardText: 'Pirate Head + Frost Drake + 30,000🪙' }, tr: { tag: '6. AY 👑', goalText: '3000 Zirve Efsanesi', rewardText: 'Korsan Başı + Buzul Ejderi + 30.000🪙' } },
    365: { en: { tag: 'YEAR 1 💥', goalText: '4000 Immortal Score', rewardText: '50,000🪙 Giant Treasure & 10,000 XP' }, tr: { tag: '1 YIL 💥', goalText: '4000 Ölümsüz Skor', rewardText: '50.000🪙 Devasa Hazine & 10.000 XP' } }
  };

  const QUESTS_TRANSLATION = {
    eat_foods: { en: 'Eat 40 Foods 🍎', tr: '40 Adet Yiyecek Ye 🍎' },
    kill_worms: { en: 'Trap & Defeat 2 Worms 💀', tr: '2 Solucanı Tuzağa Düşürüp Ez 💀' },
    reach_score: { en: 'Reach 200 Score & Grow ⭐', tr: '200 Skora Ulaş ve Büyü ⭐' },
    use_turbo: { en: 'Use Boost 5 Times ⚡', tr: '5 Kez Turbo / Hızlanma Kullan ⚡' },
    collect_gold: { en: 'Collect 8 Star Coins / Treats ⭐', tr: '8 Altın Yıldız / Değerli Yem Topla ⭐' },
    collect_powerup: { en: 'Grab 2 Power-ups (Magnet/Ghost/2X) 🧲', tr: '2 Güçlendirme (Mıknatıs/Hayalet/2X) Al 🧲' }
  };

  const I18N = {
    currentLang: 'en', // Default language is English

    init() {
      let saved = null;
      try {
        saved = localStorage.getItem('worm_language');
      } catch (e) {}

      // Default to English unless explicitly set to 'tr'
      this.currentLang = (saved === 'tr') ? 'tr' : 'en';
      document.documentElement.lang = this.currentLang;
      this.applyAll();
    },

    t(key, params = {}) {
      const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS['en'];
      let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS['en'][key] !== undefined ? TRANSLATIONS['en'][key] : key);
      if (params && typeof params === 'object') {
        for (const [k, v] of Object.entries(params)) {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
      }
      return str;
    },

    getSkinName(id) {
      const entry = SKINS_TRANSLATION[id];
      if (!entry) return id;
      return entry[this.currentLang] || entry['en'] || id;
    },

    getHatName(id) {
      const entry = HATS_TRANSLATION[id];
      if (!entry) return id;
      return entry[this.currentLang] || entry['en'] || id;
    },

    getMilestone(day) {
      const entry = MILESTONES_TRANSLATION[day];
      if (!entry) return null;
      return entry[this.currentLang] || entry['en'];
    },

    getQuestTitle(id) {
      const entry = QUESTS_TRANSLATION[id];
      if (!entry) return null;
      return entry[this.currentLang] || entry['en'];
    },

    setLang(lang, shouldReload = false) {
      this.currentLang = (lang === 'tr') ? 'tr' : 'en';
      try {
        localStorage.setItem('worm_language', this.currentLang);
      } catch (e) {}
      document.documentElement.lang = this.currentLang;

      // DOM'daki tüm data-i18n öğelerini otomatik güncelle
      this.applyAll();

      // Oyun motorunu bilgilendir
      if (window.game && typeof window.game.onLanguageChanged === 'function') {
        window.game.onLanguageChanged();
      }

      if (shouldReload) {
        setTimeout(() => {
          window.location.reload();
        }, 120);
      }
    },

    setLanguage(lang, shouldReload = false) {
      this.setLang(lang, shouldReload);
    },

    applyAll() {
      document.title = this.t('app_title');

      // 1. data-i18n etiketli metinler
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (key) {
          el.textContent = this.t(key);
        }
      });

      // 2. data-i18n-html etiketli HTML içerikler
      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (key) {
          el.innerHTML = this.t(key);
        }
      });

      // 3. data-i18n-placeholder etiketli inputlar
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) {
          el.setAttribute('placeholder', this.t(key));
        }
      });

      // 4. data-i18n-title etiketli öğeler
      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (key) {
          el.setAttribute('title', this.t(key));
        }
      });

      // 5. Ayarlar menüsündeki seçiciyi senkronize et
      const langSelect = document.getElementById('settingLanguage');
      if (langSelect) {
        langSelect.value = this.currentLang;
      }
    }
  };

  window.I18N = I18N;

  // DOMContentLoaded olduğunda otomatik başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => I18N.init());
  } else {
    I18N.init();
  }
})(window);
