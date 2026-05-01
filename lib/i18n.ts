export const locales = ["en", "jp"];
export const defaultLocale = "en";

export type TranslationSchema = typeof translations.en;

export const translations = {
  en: {
    appName: "TCG Finder Japan",
    navbar: {
      home: "Home",
      ranking: "Ranking",
      contact: "Contact",

      myPage: "My Page",
      favorites: "Favorites",
      viewedHistory: "Viewed History",
      logout: "Logout",
      login: "Login",
    },

    favorites: {
      title: "Favorite Shops",
      subtitle: "Your saved card shops",
      emptyTitle: "No favorite shops yet",
      emptyDesc: "Explore shops and add them to your favorites ❤️",
      removing: "Removing from favorites...",
      unknownLocation: "Unknown location",
    },

    buttons: {
      login: "Login",
      logout: "Logout",
      viewDetails: "View Details",
    },
    common: {
      cancel: "Cancel",
      retry: "Retry",
      back: "Back",
      somethingWrong: "Something went wrong",
      uploadFailed: "Upload failed",
      loading: "Loading...",
      unknownLocation: "Unknown location",
    },

    account: {
      title: "My Account",
      subtitle: "Manage your account and settings",
      joined: "Joined",
    },

    stats: {
      favoriteShops: "Favorite Shops",
      recentlyViewedShops: "Recently Viewed Shops",
    },

    history: {
      emptyTitle: "No viewing history yet",
      emptyDesc: "Your viewed shops will appear here",
      title: "Recently Viewed Shops",
      subtitle: "A list of shops you recently visited",
      viewedAt: "Viewed at",
    },
    csvImport: {
      title: "CSV Import",
      subtitle: "Upload a CSV file to bulk register shop data",

      uploadTitle: "Upload CSV file",
      uploadHint: "Drag & drop or click to select a file",

      rowsDetected: "row detected",
      uploading: "Uploading...",
      importData: "Import Data",

      previewNote: "Showing first 10 rows (preview)",

      table: {
        shopName: "Shop name",
        address: "Address",
        website: "Website",
        mondayHours: "Monday hours",
        closed: "Closed",
      },

      success: "CSV imported successfully",
      uploadFailed: "Upload failed",
    },
    adminReports: {
      title: "Review Management",
      filters: {
        all: "All",
        pending: "Pending",
        resolved: "Resolved",
      },

      stats: {
        total: "Total",
        pending: "Pending",
        resolved: "Resolved",
      },

      report: {
        emptyState: {
          title: "No reports found",
          allResolved: "All reports have been resolved.",
          noneResolved: "No resolved reports yet.",
          noIssues: "No issues found.",
        },
        reasonLabel: "Report Reason",
        resolved: "Resolved",
        pending: "Pending",
      },

      actions: {
        delete: "Delete Review",
        markResolved: "Mark as Resolved",
        resolved: "Resolved",
        viewShop: "View Shop Page",
      },

      toast: {
        deleteSuccess: "Review deleted successfully",
        deleteError: "Failed to delete",
        resolveSuccess: "Marked as resolved",
        resolveError: "Failed to update",
      },

      pagination: {
        previous: "Previous",
        next: "Next",
      },
    },
    admin: {
      footer: "TCG Finder Japan Admin",
      sidebar: {
        title: "Admin Panel",
        overview: "Overview",
        shops: "Shops",
        reports: "Reports",
        importCsv: "Import CSV",
      },

      dashboard: {
        stats: {
          totalShops: "Total Shops",
          newShopsToday: "New Shops Today",
          reviews: "Reviews",
          users: "Users",
        },
      },

      navbar: {
        subtitle: "Admin Dashboard",
        goToSite: "View Site",
      },
      shopsPage: {
        title: "Shops",
        addShop: "Add Shop",
        addNewShop: "Add New Shop",

        loading: "Loading shops",
        empty: "No shops have been registered yet.",
        error: "Failed to load shops. Please try again.",
        retry: "Retry",
      },

      recentShops: {
        title: "Recently Added Stores",
        subtitle: "Latest shops added to the portal",

        stats: {
          openToday: "Open Today",
          closedToday: "Closed Today",
        },

        states: {
          loading: "Loading",
          error: "Failed to load recent shops",
          emptyTitle: "No shops have been registered yet.",
          emptyDesc: "Add your first shop and start listing card shops.",
        },

        table: {
          shop: "Shop",
          address: "Address",
          reviews: "Reviews",
          createdAt: "Created At",
          actions: "Actions",
          open: "Open",
          closed: "Closed",
          unknown: "Unknown",
        },

        actions: {
          view: "View",
          viewDetails: "View Details",
        },
      },
      shopForm: {
        editTitle: "Edit Shop",
        createTitle: "Create New Shop",

        editDesc: "Update shop information in the portal directory",
        createDesc: "Add a new card shop to the portal directory",

        successDelete: "Shop deleted successfully",
        successCreate: "Shop created successfully",
        successUpdate: "Shop updated successfully",
        error: "Failed to save shop",

        sections: {
          shopInfo: "Shop Information",
          location: "Location",
          details: "Details",
          holidayHours: "Holiday hours",

          photos: "Shop photos",
          reels: "Instagram Reels",
          productTags: "Product Tags",
          businessHours: "Business hours (by day)",
          businessDays: {
            monday: "Monday",
            tuesday: "Tuesday",
            wednesday: "Wednesday",
            thursday: "Thursday",
            friday: "Friday",
            saturday: "Saturday",
            sunday: "Sunday",
          },
        },

        fields: {
          name: "Name",
          address: "Address",
          latitude: "Latitude",
          longitude: "Longitude",
          closed: "Closed",
          website: "Website",
          description: "Description",
          x_account_url: "X (Twitter) Account URL",
          language: "Language support",
          namePlaceholder: "Tokyo Card Haven",
addressPlaceholder: "Shibuya, Tokyo",
languagePlaceholder: "Japanese, English",
          descriptionPlaceholder: "Enter a short description of the shop",
        },

        upload: {
          title: "Upload images",
          filesSelected: "files selected",
          hint: "Drag & drop or click to select",
        },

        actions: {
          create: "Create Shop",
          update: "Update Shop",
          creating: "Creating...",
          updating: "Updating...",
          delete: "Delete",
          addReel: "＋ Add Reel",
        },
        extras: {
          reelPlaceholder: "https://www.instagram.com/reel/...",
          productTags: {
            vintage: "Vintage",
            psa: "PSA",
            box: "BOX",
          },
        },
      },
      deleteDialog: {
        title: "Delete Shop",
        description: "Are you sure you want to delete",
        confirmText: "This action cannot be undone.",
        cancel: "Cancel",
        delete: "Delete",
      },
    },
    auth: {
      forgetPassword: {
        forgotTitle: "Forgot Password",
        forgotDesc: "Enter your email and we'll send you a reset link",
        email: "Enter your email",
        sendReset: "Send Reset Link",
        sending: "Sending...",
        resetSent: "Reset link sent! Check your email.",
        backToLogin: "Remember your password?",
        login: "Login",
        requiredEmail: "Please enter your email",
        error: "Something went wrong",
      },
      resetPassword: {
        resetTitle: "Reset Password",
        resetDesc: "Enter your new password below",
        newPassword: "New password",
        confirmPassword: "Confirm password",
        updatePassword: "Update Password",
        updating: "Updating...",
        resetSuccess: "Password updated successfully! Redirecting...",
        requiredPassword: "Please fill all fields",
        passwordMismatch: "Passwords do not match",
      },
      common: {
        back: "Back",
        email: "Email Address",
        password: "Password",
      },

      login: {
        title: "Welcome back",
        subtitle: "Log in to your account",
        required: "Please fill all fields",

        button: "Log In",
        loading: "Logging in...",

        success: "Logged in successfully",
        forgot: "Forgot password?",
        switchText: "Don’t have an account?",
        switchAction: "Sign Up",
      },

      signup: {
        title: "Create Account",
        subtitle: "Let’s get started",

        name: "Name",
        confirmPassword: "Confirm Password",

        button: "Sign Up",
        loading: "Creating...",

        success: "Account created successfully",
        passwordMismatch: "Passwords do not match",

        switchText: "Already have an account?",
        switchAction: "Log In",
      },
    },
    map: {
      loading: "Loading shops...",
      loginRequired: "Please log in to use favorites.",

      search: {
        placeholder: "Search by shop name, area, or address",
      },

      filters: {
        title: "Filters",
        area: "Area",
        productTags: "Product Tags",
        language: "Language",
        openNow: "Open Now",
        favoritesOnly: "Favorites Only",
        clear: "Clear Filters",
        apply: "Apply Filters",
      },
    },

    ranking: {
      title: "Card Shop Rankings",
      subtitle:
        "Discover popular trading card shops in Japan based on real user reviews",

      stats: {
        shops: "shops",
        weighted: "Weighted Ranking",
      },

      row: {
        unknownShop: "Unknown Shop",
        reviews: "reviews",
        selection: "Selection",
        price: "Price",
        score: "Score",
      },

      filters: {
        selectArea: "Select Area",
        selectTag: "Select Tag",
        searchArea: "Search area...",
        searchTag: "Search tag...",
        noResults: "No results",
        all: "All",
        tokyoArea: "Tokyo Area",
        prefectures: "Prefectures",
        tags: "Tags",
      },

      empty: "No shops found matching your criteria",
      topCard: {
        reviews: "reviews",
        selection: "Selection",
        price: "Price",
        viewDetails: "View Details →",
      },
      areas: {
        akihabara: "Akihabara",
        ikebukuro: "Ikebukuro",
        tokyo: "Tokyo",

        hokkaido: "Hokkaido",
        aomori: "Aomori",
        iwate: "Iwate",
        miyagi: "Miyagi",
        akita: "Akita",
        yamagata: "Yamagata",
        fukushima: "Fukushima",

        ibaraki: "Ibaraki",
        tochigi: "Tochigi",
        gunma: "Gunma",
        saitama: "Saitama",
        chiba: "Chiba",
        kanagawa: "Kanagawa",

        niigata: "Niigata",
        toyama: "Toyama",
        ishikawa: "Ishikawa",
        fukui: "Fukui",
        yamanashi: "Yamanashi",
        nagano: "Nagano",

        gifu: "Gifu",
        shizuoka: "Shizuoka",
        aichi: "Aichi",
        mie: "Mie",

        shiga: "Shiga",
        kyoto: "Kyoto",
        osaka: "Osaka",
        hyogo: "Hyogo",
        nara: "Nara",
        wakayama: "Wakayama",

        tottori: "Tottori",
        shimane: "Shimane",
        okayama: "Okayama",
        hiroshima: "Hiroshima",
        yamaguchi: "Yamaguchi",

        tokushima: "Tokushima",
        kagawa: "Kagawa",
        ehime: "Ehime",
        kochi: "Kochi",

        fukuoka: "Fukuoka",
        saga: "Saga",
        nagasaki: "Nagasaki",
        kumamoto: "Kumamoto",
        oita: "Oita",
        miyazaki: "Miyazaki",
        kagoshima: "Kagoshima",
        okinawa: "Okinawa",
      },
    },
    reviews: {
      deleteDialog: {
        title: "Delete this review?",
        description: "This action cannot be undone.",
        cancel: "Cancel",
        confirm: "Delete",
        success: "Review deleted successfully",
      },

      reportModal: {
        title: "Report Review",
        selectReason: "Select a reason",
        spam: "Spam",
        abuse: "Inappropriate Content",
        fake: "Fake Review",
        other: "Other",
        placeholder: "Enter your reason...",
        cancel: "Cancel",
        submit: "Report",
        submitting: "Submitting...",
        success: "Report submitted successfully",
        error: "An error occurred",
        required: "Please select a reason",
      },

      card: {
        yourReview: "Your Review",
        report: "Report",
        edit: "Edit",
        delete: "Delete",

        productSelection: "Product Selection",
        price: "Price",

        underReview: "Under Review",
      },
      list: {
        loginToView: "Log in to view reviews",
        login: "Log In",
      },

      form: {
        write: "Write a Review",
        edit: "Edit Review",

        selectionLabel: "Product Selection (variety & stock)",
        priceLabel: "Price (pricing impression)",

        placeholder: "Share your experience...",
        addImages: "Add Images",

        submit: "Submit",
        submitting: "Submitting...",
        update: "Update",
        updating: "Updating...",

        cancel: "Cancel",

        errors: {
          ratingRequired: "Please provide ratings",
          uploadFailed: "Failed to upload",
        },

        success: {
          create: "Review submitted successfully",
          update: "Review updated successfully",
        },
      },

      section: {
        title: "Reviews",

        loginRequired: "You need to log in to post a review",
        alreadyReviewed: "You have already submitted a review",
        editReview: "Edit Review",

        sort: {
          placeholder: "Sort",
          latest: "Latest",
          highest: "Highest Rated",
          lowest: "Lowest Rated",
        },
      },
    },
    shopDetails: {
      videos: {
        title: "Store Video",
      },
      related: {
        title: "Related Shops",
      },
      tweetCard: {
        title: "Latest Updates",
      },
      header: {
        open: "Open",
        closed: "Closed",
      },

      list: {
        empty: "No matching shops found",
        addToFavorites: "Add to favorites",
        removeFromFavorites: "Remove from favorites",
      },

      page: {
        loading: "Loading...",
        notFound: "Shop not found",

        back: "Back",
        shopList: "Shop List",

        noImage: "No image",
        details: "Details",

        addFavorite: "Add to favorites",
        removeFavorite: "Remove from favorites",

        addFavToast: "Adding to favorites...",
        removeFavToast: "Removing from favorites...",
        loginRequired: "Please log in first",
        error: "Something went wrong",
      },
    },
    contact: {
      title: "Contact Us",
      desc: "Have questions or suggestions? Feel free to reach out.",
      name: "Your Name",
      email: "Your Email",
      message: "Your Message",
      send: "Send Message",
      alt: "Or contact us directly at",
      success: "Message sent successfully!",
      error: "Failed to send message. Please try again.",
      required: "Please fill all fields",
    },
    footer: {
      brand: {
        title: "TCG Finder Japan",
        description:
          "Discover the best trading card shops across Japan. Explore locations, reviews, and rankings for Pokémon and other card stores.",
      },

      explore: {
        title: "Explore",
        map: "Map",
        rankings: "Rankings",
        login: "Login",
        signup: "Sign Up",
      },

      info: {
        title: "Info",
        international: "For international visitors to Japan",
        updated: "Data updated regularly",
        powered: "Powered by Google Maps",
      },

      legal: {
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      },

      bottom: {
        rights: "All rights reserved.",
      },
    },
    accountLayout: {
      back: "Back",
      profile: "Profile",

      breadcrumb: {
        account: "Account",
        myPage: "My Page",
        favorites: "Favorite Shops",
        viewedHistory: "Viewed History",
      },
    },
    privacy: {
      title: "Privacy Policy",
      intro:
        'TCG Finder Japan ("we", "our", "us") respects your privacy and is committed to protecting your personal information.',

      sections: {
        collect: {
          title: "Information We Collect",
          desc: "We may collect basic account information such as email address, as well as usage data including pages visited and interactions on the site.",
        },
        usage: {
          title: "How We Use Information",
          desc: "We use collected data to improve our services, personalize user experience, and maintain platform functionality.",
        },
        thirdParty: {
          title: "Third-Party Services",
          desc: "We use third-party services such as Google Maps and advertising providers, which may collect anonymized usage data.",
        },
        protection: {
          title: "Data Protection",
          desc: "We take reasonable measures to protect your data, but cannot guarantee absolute security.",
        },
        changes: {
          title: "Changes",
          desc: "We may update this policy from time to time. Continued use of the service means you accept those changes.",
        },
      },
    },
    terms: {
      title: "Terms of Service",
      intro:
        "By accessing and using TCG Finder Japan, you agree to comply with these terms.",

      sections: {
        responsibilities: {
          title: "User Responsibilities",
          desc: "Users must provide accurate information and are responsible for any content they post, including reviews and comments.",
        },
        prohibited: {
          title: "Prohibited Activities",
          desc: "Users must not engage in harmful activities such as spamming, abuse, or misuse of the platform.",
        },
        content: {
          title: "Content Management",
          desc: "We reserve the right to remove content or suspend accounts that violate these terms.",
        },
        liability: {
          title: "Limitation of Liability",
          desc: "We are not responsible for any damages resulting from the use of this platform.",
        },
        changes: {
          title: "Changes to Terms",
          desc: "These terms may be updated at any time. Continued use of the service implies acceptance of the updated terms.",
        },
      },
    },
  },

  jp: {
    appName: "TCG Finder Japan",
    navbar: {
      home: "ホーム",
      ranking: "ランキング",
      contact: "お問い合わせ",

      myPage: "マイページ",
      favorites: "お気に入り",
      viewedHistory: "閲覧履歴",
      logout: "ログアウト",
      login: "ログイン",
    },

    favorites: {
      title: "お気に入り店舗",
      subtitle: "保存したカードショップ",
      emptyTitle: "お気に入りの店舗はまだありません",
      emptyDesc: "店舗を探してお気に入りに追加しましょう ❤️",
      removing: "お気に入りから削除中...",
      unknownLocation: "不明な場所",
    },

    buttons: {
      login: "ログイン",
      logout: "ログアウト",
      viewDetails: "詳細を見る",
    },

    common: {
      back: "戻る",
      cancel: "キャンセル",
      retry: "再試行",
      somethingWrong: "問題が発生しました",
      uploadFailed: "アップロードに失敗しました",
      loading: "読み込み中...",
      unknownLocation: "不明な場所",
    },

    account: {
      title: "マイアカウント",
      subtitle: "アカウントと設定を管理",
      joined: "登録日",
    },

    stats: {
      favoriteShops: "お気に入り店舗",
      recentlyViewedShops: "最近閲覧した店舗",
    },

    history: {
      emptyTitle: "閲覧履歴はまだありません",
      emptyDesc: "閲覧した店舗がここに表示されます",
      title: "最近閲覧した店舗",
      subtitle: "最近訪れた店舗一覧",
      viewedAt: "閲覧日時",
    },

    csvImport: {
      title: "CSVインポート",
      subtitle: "CSVファイルをアップロードして店舗データを一括登録",

      uploadTitle: "CSVファイルをアップロード",
      uploadHint: "ドラッグ＆ドロップまたはクリックして選択",

      rowsDetected: "行を検出",
      uploading: "アップロード中...",
      importData: "データをインポート",

      previewNote: "最初の10行を表示（プレビュー）",

      table: {
        shopName: "店舗名",
        address: "住所",
        website: "ウェブサイト",
        mondayHours: "月曜日の営業時間",
        closed: "休業",
      },

      success: "CSVのインポートに成功しました",
      uploadFailed: "アップロードに失敗しました",
    },

    adminReports: {
      title: "レビュー管理",

      filters: {
        all: "すべて",
        pending: "未対応",
        resolved: "対応済み",
      },

      stats: {
        total: "合計",
        pending: "未対応",
        resolved: "対応済み",
      },

      report: {
        emptyState: {
          title: "レポートが見つかりません",
          allResolved: "すべてのレポートは対応済みです。",
          noneResolved: "対応済みのレポートはまだありません。",
          noIssues: "問題は見つかりませんでした。",
        },
        reasonLabel: "通報理由",
        resolved: "対応済み",
        pending: "未対応",
      },

      actions: {
        delete: "削除 レビュー",
        markResolved: "対応済みにする",
        resolved: "対応済み",
        viewShop: "店舗ページを見る",
      },

      toast: {
        deleteSuccess: "レビューを削除しました",
        deleteError: "削除に失敗しました",
        resolveSuccess: "対応済みにしました",
        resolveError: "更新に失敗しました",
      },

      pagination: {
        previous: "前へ",
        next: "次へ",
      },
    },

    admin: {
      sidebar: {
        title: "管理パネル",
        overview: "概要",
        shops: "店舗",
        reports: "レポート",
        importCsv: "CSVインポート",
      },

      dashboard: {
        stats: {
          totalShops: "店舗数",
          newShopsToday: "本日の新規店舗",
          reviews: "レビュー",
          users: "ユーザー",
        },
      },

      navbar: {
        subtitle: "管理ダッシュボード",
        goToSite: "サイトを見る",
      },

      shopsPage: {
        title: "店舗",
        addShop: "店舗を追加",
        addNewShop: "新しい店舗を追加",

        loading: "店舗を読み込み中",
        empty: "登録された店舗はまだありません",
        error: "店舗の読み込みに失敗しました",
        retry: "再試行",
      },

      recentShops: {
        title: "最近追加された店舗",
        subtitle: "最新の店舗一覧",

        stats: {
          openToday: "本日営業",
          closedToday: "本日休業",
        },

        states: {
          loading: "読み込み中",
          error: "店舗の取得に失敗しました",
          emptyTitle: "店舗がまだ登録されていません",
          emptyDesc: "最初の店舗を追加しましょう",
        },

        table: {
          shop: "店舗",
          address: "住所",
          reviews: "レビュー",
          createdAt: "作成日",
          actions: "操作",
          open: "営業中",
          closed: "休業中",
          unknown: "不明",
        },

        actions: {
          view: "表示",
          viewDetails: "詳細を見る",
        },
      },
      deleteDialog: {
        title: "店舗を削除",
        description: "本当に削除しますか",
        confirmText: "この操作は元に戻せません。",
        cancel: "キャンセル",
        delete: "削除",
      },
      shopForm: {
        editTitle: "店舗を編集",
        createTitle: "新しい店舗を作成",

        editDesc: "ポータル内の店舗情報を更新します",
        createDesc: "新しいカードショップを登録します",
        successDelete: "店舗を削除しました",
        successCreate: "店舗の作成に成功しました",
        successUpdate: "店舗の更新が完了しました",
        error: "店舗の保存に失敗しました",

        sections: {
          shopInfo: "店舗情報",
          location: "位置情報",
          details: "詳細",
          holidayHours: "祝日の営業時間",
          photos: "店舗写真",
          businessHours: "営業時間（曜日別）",
          businessDays: {
            monday: "月曜日",
            tuesday: "火曜日",
            wednesday: "水曜日",
            thursday: "木曜日",
            friday: "金曜日",
            saturday: "土曜日",
            sunday: "日曜日",
          },
          reels: "Instagramリール",
          productTags: "商品タグ",
        },

        fields: {
          name: "店舗名",
          address: "住所",
          website: "ウェブサイト",
          latitude: "緯度",
          longitude: "経度",
          closed: "休業",
          x_account_url: "X（旧Twitter）アカウントURL",
          language: "対応言語",
          description: "説明",
          namePlaceholder: "東京カードショップ",
addressPlaceholder: "東京都渋谷区",
languagePlaceholder: "日本語・英語",
          descriptionPlaceholder: "店舗の説明を入力してください",
        },

        upload: {
          title: "画像をアップロード",
          filesSelected: "件のファイルを選択",
          hint: "ドラッグ＆ドロップまたはクリックして選択",
        },

        actions: {
          create: "店舗を作成",
          update: "店舗を更新",
          creating: "作成中...",
          delete: "削除",
          updating: "更新中...",
          addReel: "＋ リールを追加",
        },
        extras: {
          reelPlaceholder: "https://www.instagram.com/reel/...",
          productTags: {
            vintage: "ヴィンテージ",
            psa: "PSA鑑定",
            box: "ボックス",
          },
        },
      },
      footer: "TCG Finder Japan 管理画面",
    },
    reviews: {
      deleteDialog: {
        title: "このレビューを削除しますか？",
        description: "この操作は元に戻せません。",
        cancel: "キャンセル",
        confirm: "削除",
        success: "レビューを削除しました",
      },

      reportModal: {
        title: "レビューを報告",
        selectReason: "理由を選択",
        spam: "スパム",
        abuse: "不適切な内容",
        fake: "偽のレビュー",
        other: "その他",
        placeholder: "理由を入力してください...",
        cancel: "キャンセル",
        submit: "報告",
        submitting: "送信中...",
        success: "報告が送信されました",
        error: "エラーが発生しました",
        required: "理由を選択してください",
      },

      card: {
        yourReview: "あなたのレビュー",
        report: "報告",
        edit: "編集",
        delete: "削除",
        productSelection: "品揃え",
        price: "価格",
        underReview: "審査中",
      },

      list: {
        loginToView: "レビューを見るにはログインしてください",
        login: "ログイン",
      },

      form: {
        write: "レビューを書く",
        edit: "レビューを編集",
        selectionLabel: "品揃え（種類・在庫）",
        priceLabel: "価格（印象）",
        placeholder: "体験を共有してください...",
        addImages: "画像を追加",
        submit: "投稿",
        submitting: "送信中...",
        update: "更新",
        updating: "更新中...",
        cancel: "キャンセル",

        errors: {
          ratingRequired: "評価を入力してください",
          uploadFailed: "アップロードに失敗しました",
        },

        success: {
          create: "レビューを投稿しました",
          update: "レビューを更新しました",
        },
      },

      section: {
        title: "レビュー",
        loginRequired: "レビュー投稿にはログインが必要です",
        alreadyReviewed: "すでにレビューを投稿しています",
        editReview: "レビューを編集",

        sort: {
          placeholder: "並び替え",
          latest: "最新",
          highest: "評価が高い",
          lowest: "評価が低い",
        },
      },
    },
    auth: {
      forgetPassword: {
        forgotTitle: "パスワードをお忘れですか？",
        forgotDesc:
          "メールアドレスを入力すると、リセット用リンクを送信します。",
        email: "メールアドレスを入力",
        sendReset: "リセットリンクを送信",
        sending: "送信中...",
        resetSent: "リセットリンクを送信しました。メールをご確認ください。",
        backToLogin: "パスワードを思い出しましたか？",
        login: "ログイン",
        requiredEmail: "メールアドレスを入力してください",
        error: "エラーが発生しました",
      },
      resetPassword: {
        resetTitle: "パスワードの再設定",
        resetDesc: "新しいパスワードを入力してください",
        newPassword: "新しいパスワード",
        confirmPassword: "パスワードを再入力",
        updatePassword: "パスワードを更新",
        updating: "更新中...",
        resetSuccess: "パスワードが更新されました。リダイレクトしています...",
        requiredPassword: "すべての項目を入力してください",
        passwordMismatch: "パスワードが一致しません",
      },
      common: {
        back: "戻る",
        email: "メールアドレス",
        password: "パスワード",
      },

      login: {
        title: "おかえりなさい",
        subtitle: "アカウントにログイン",

        button: "ログイン",
        loading: "ログイン中...",
        forgot: "パスワードをお忘れですか？",
        required: "すべての項目を入力してください",

        success: "ログインしました",

        switchText: "アカウントをお持ちでないですか？",
        switchAction: "新規登録",
      },

      signup: {
        title: "アカウント作成",
        subtitle: "さあ始めましょう",

        name: "名前",
        confirmPassword: "パスワード確認",

        button: "登録",
        loading: "作成中...",

        success: "アカウントを作成しました",
        passwordMismatch: "パスワードが一致しません",

        switchText: "すでにアカウントをお持ちですか？",
        switchAction: "ログイン",
      },
    },

    map: {
      loading: "店舗を読み込み中...",
      loginRequired: "お気に入り機能を使うにはログインしてください",

      search: {
        placeholder: "店舗名・エリア・住所で検索",
      },

      filters: {
        title: "フィルター",
        area: "エリア",
        productTags: "商品タグ",
        language: "言語",
        openNow: "営業中",
        favoritesOnly: "お気に入りのみ",
        clear: "クリア",
        apply: "フィルターを適用",
      },
    },

    ranking: {
      title: "カードショップランキング",
      subtitle: "ユーザーレビューに基づく人気店舗をチェック",

      stats: {
        shops: "店舗",
        weighted: "総合ランキング",
      },

      row: {
        unknownShop: "不明な店舗",
        reviews: "レビュー",
        selection: "品揃え",
        price: "価格",
        score: "スコア",
      },

      filters: {
        selectArea: "エリアを選択",
        selectTag: "タグを選択",
        searchArea: "エリア検索...",
        searchTag: "タグ検索...",
        noResults: "結果なし",
        all: "すべて",
        tokyoArea: "東京エリア",
        prefectures: "都道府県",
        tags: "タグ",
      },
      topCard: {
        reviews: "レビュー",
        selection: "品揃え",
        price: "価格",
        viewDetails: "詳細を見る →",
      },
      areas: {
        akihabara: "秋葉原",
        ikebukuro: "池袋",
        tokyo: "東京",

        hokkaido: "北海道",
        aomori: "青森県",
        iwate: "岩手県",
        miyagi: "宮城県",
        akita: "秋田県",
        yamagata: "山形県",
        fukushima: "福島県",

        ibaraki: "茨城県",
        tochigi: "栃木県",
        gunma: "群馬県",
        saitama: "埼玉県",
        chiba: "千葉県",
        kanagawa: "神奈川県",

        niigata: "新潟県",
        toyama: "富山県",
        ishikawa: "石川県",
        fukui: "福井県",
        yamanashi: "山梨県",
        nagano: "長野県",

        gifu: "岐阜県",
        shizuoka: "静岡県",
        aichi: "愛知県",
        mie: "三重県",

        shiga: "滋賀県",
        kyoto: "京都府",
        osaka: "大阪府",
        hyogo: "兵庫県",
        nara: "奈良県",
        wakayama: "和歌山県",

        tottori: "鳥取県",
        shimane: "島根県",
        okayama: "岡山県",
        hiroshima: "広島県",
        yamaguchi: "山口県",

        tokushima: "徳島県",
        kagawa: "香川県",
        ehime: "愛媛県",
        kochi: "高知県",

        fukuoka: "福岡県",
        saga: "佐賀県",
        nagasaki: "長崎県",
        kumamoto: "熊本県",
        oita: "大分県",
        miyazaki: "宮崎県",
        kagoshima: "鹿児島県",
        okinawa: "沖縄県",
      },
      empty: "条件に一致する店舗が見つかりません",
    },
    shopDetails: {
      videos: {
        title: "店舗動画",
      },
      tweetCard: {
        title: "最新の投稿",
      },
      related: {
        title: "関連店舗",
      },

      header: {
        open: "営業中",
        closed: "休業中",
      },

      list: {
        empty: "該当する店舗が見つかりません",
        addToFavorites: "お気に入りに追加",
        removeFromFavorites: "お気に入りから削除",
      },
      page: {
        loading: "読み込み中...",
        notFound: "店舗が見つかりません",

        back: "戻る",
        shopList: "店舗一覧",

        noImage: "画像なし",
        details: "詳細",

        addFavorite: "お気に入りに追加",
        removeFavorite: "お気に入りから削除",

        addFavToast: "お気に入りに追加中...",
        removeFavToast: "お気に入りから削除中...",
        loginRequired: "ログインしてください",
        error: "問題が発生しました",
      },
    },
    footer: {
      brand: {
        title: "TCG Finder Japan",
        description:
          "日本全国のカードショップを探そう。レビューやランキングで人気店舗をチェックできます。",
      },

      explore: {
        title: "探索",
        map: "マップ",
        rankings: "ランキング",
        login: "ログイン",
        signup: "登録",
      },

      info: {
        title: "情報",
        international: "訪日外国人向け",
        updated: "データは定期更新",
        powered: "Google Mapsを使用",
      },

      legal: {
        privacy: "プライバシーポリシー",
        terms: "利用規約",
      },

      bottom: {
        rights: "無断転載禁止",
      },
    },
    accountLayout: {
      back: "戻る",
      profile: "プロフィール",

      breadcrumb: {
        account: "アカウント",
        myPage: "マイページ",
        favorites: "お気に入り店舗",
        viewedHistory: "閲覧履歴",
      },
    },
    privacy: {
      title: "プライバシーポリシー",
      intro:
        "TCG Finder Japan（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。",

      sections: {
        collect: {
          title: "収集する情報",
          desc: "当サービスでは、メールアドレスなどの基本的なアカウント情報や、閲覧したページや操作履歴などの利用データを収集する場合があります。",
        },
        usage: {
          title: "情報の利用目的",
          desc: "収集した情報は、サービスの改善、ユーザー体験の向上、および機能の維持のために利用されます。",
        },
        thirdParty: {
          title: "第三者サービス",
          desc: "当サービスでは、Google Mapsや広告配信サービスなどの第三者サービスを利用しており、匿名の利用データが収集される場合があります。",
        },
        protection: {
          title: "データの保護",
          desc: "当サービスは、ユーザーの情報を保護するために適切な対策を講じていますが、完全な安全性を保証するものではありません。",
        },
        changes: {
          title: "ポリシーの変更",
          desc: "本ポリシーは必要に応じて変更される場合があります。サービスの継続利用により、変更内容に同意したものとみなされます。",
        },
      },
    },
    terms: {
      title: "利用規約",
      intro:
        "TCG Finder Japan（以下「当サービス」）を利用することにより、本規約に同意したものとみなされます。",

      sections: {
        responsibilities: {
          title: "ユーザーの責任",
          desc: "ユーザーは正確な情報を提供する必要があり、投稿したレビューやコメントを含むすべてのコンテンツに責任を負います。",
        },
        prohibited: {
          title: "禁止事項",
          desc: "スパム行為、誹謗中傷、または本サービスの不正利用など、有害な行為を行ってはなりません。",
        },
        content: {
          title: "コンテンツ管理",
          desc: "当サービスは、本規約に違反するコンテンツの削除やアカウントの停止を行う権利を有します。",
        },
        liability: {
          title: "免責事項",
          desc: "本サービスの利用により生じた損害について、当サービスは一切の責任を負いません。",
        },
        changes: {
          title: "規約の変更",
          desc: "本規約は予告なく変更される場合があります。サービスを継続して利用することで、変更後の規約に同意したものとみなされます。",
        },
      },
    },
    contact: {
      title: "お問い合わせ",
      desc: "ご質問やご提案がございましたら、お気軽にご連絡ください。",
      name: "お名前",
      email: "メールアドレス",
      message: "メッセージ",
      send: "送信する",
      alt: "または、こちらから直接ご連絡ください",
      success: "メッセージが送信されました！",
      error: "送信に失敗しました。もう一度お試しください。",
      required: "すべての項目を入力してください",
    },
  },
};
