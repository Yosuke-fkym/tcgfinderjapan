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
      blog: "Blog",
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
        shopVideo: "Shop video",
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
        articles: "Articles",
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
          area: "Area",
          closed: "Closed",
          website: "Website",
          shopIcon: "Shop Icon",
          uploadIcon: "Upload Icon",
          iconHint: "Square image recommended. PNG, JPG, WebP accepted.",
          removeIcon: "Remove Icon",
          changeIcon: "Change Icon",
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
            pokémon: "Pokémon",
            onepiece: "ONE PIECE",
            dragonball: "DRAGON BALL",
            cashonly: "Cash only",
            cardsaccepted: "Cards accepted",
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
    about: {
      title: "About Us",
      subtitle:
        "Information about the operation and purpose of TCG Finder Japan.",

      operatorLabel: "Operator:",
      operator: "TCG Finder Japan Manangement Office",

      websiteLabel: "Website:",

      purposeLabel: "Purpose:",
      purpose:
        "This website aims to collect and organize information about trading card game (TCG) shops across Japan, especially to help collectors and players visiting Japan from overseas easily find the card shops they are looking for.",

      activitiesLabel: "Activities:",
      activities:
        "We provide easy-to-understand map-based information about TCG shop locations throughout Japan, supported card categories (such as Pokémon and One Piece), PSA graded products, sealed box availability, and more. We strive to keep the information as up to date as possible.",

      contactLabel: "Contact:",
      contactButton: "Contact Form",
      contactDesc:
        "For inquiries regarding this website, correction requests, advertising opportunities, or general feedback, please contact us through the contact form below.",

      disclaimerLabel: "Disclaimer:",
      disclaimer:
        "While we make every effort to ensure the accuracy of the information provided on this website, details such as store locations and business hours may change over time. Please also check each store’s official website or social media accounts for the latest information.",
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
        about: "About Us",
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
        "TCG Finder Japan respects your privacy and is committed to protecting your personal information.",

      sections: {
        collect: {
          title: "1. Information We Collect",
          desc: "We may collect personal information such as email addresses submitted through contact forms, as well as usage data including visited pages and interaction history.",
        },

        usage: {
          title: "2. Purpose of Use",
          desc: "Collected information is used to respond to inquiries, improve the service, enhance user experience, and maintain platform functionality.",
        },

        ads: {
          title: "3. Advertising (Google AdSense)",
          desc1:
            "This service uses the third-party advertising service Google AdSense.",

          desc2:
            "Third-party vendors including Google use cookies to display personalized advertisements based on users’ previous visits to this and other websites.",

          desc3:
            "By using cookies for advertising, Google and its partners can display appropriate advertisements to users based on their visits to this and other sites.",
          desc4:
            "Users can disable personalized advertising through Google Ad Settings. In addition, users can disable cookies used for personalized advertising by third-party vendors by visiting www.aboutads.info.",
          link: "https://www.aboutads.info/",
        },

        analytics: {
          title: "4. Analytics Tools",
          desc: "This service uses Google Analytics to analyze traffic and usage trends. Anonymous traffic data may be collected using cookies.",
        },

        thirdParty: {
          title: "5. Third-Party Services",
          desc: "We use third-party services such as Google Maps API, which may also collect anonymized usage data.",
        },

        protection: {
          title: "6. Data Protection",
          desc: "We take appropriate measures to protect user information, although complete security cannot be guaranteed.",
        },

        disclaimer: {
          title: "7. Disclaimer",
          desc: "While we strive to keep information accurate, we are not responsible for actions taken based on information provided on this service. TCG inventory and prices may change frequently, so please confirm final details directly with each store.",
        },

        changes: {
          title: "8. Policy Changes",
          desc: "This policy may be updated when necessary. Changes become effective once published on this page.",
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
    passwordGate: {
      protectedArticle: "Protected Article",
      description:
        "This article requires a password to access. Enter the password below to unlock it.",

      passwordLabel: "Password",
      passwordPlaceholder: "Enter password...",

      hidePassword: "Hide password",
      showPassword: "Show password",

      incorrectPassword: "Incorrect password. Please try again.",
      somethingWentWrong: "Something went wrong. Please try again.",

      verifying: "Verifying...",
      unlockArticle: "Unlock Article",

      footerText: "Password provided upon purchase.",
      needHelp: "Need help?",
    },
    blogCategory: {
      breadcrumb: {
        blog: "Blog",
      },

      hero: {
        categoryLabel: "Category",
        articles: "Articles",
        description:
          "Browse all articles related to {category} cards, market insights, store guides, and community updates.",
      },

      stats: {
        articles: "Articles",
      },

      grid: {
        emptyMessage:
          "No articles have been published in {category} yet. Check back soon.",
      },
    },
    blogTag: {
      breadcrumb: {
        blog: "Blog",
        tag: "Tag",
      },

      hero: {
        label: "Tag",
        articles: "Articles",
        description: "Browse all articles tagged with {tag}.",
      },

      stats: {
        articles: "Articles",
      },

      grid: {
        emptyMessage:
          "No articles have been tagged with {tag} yet. Check back soon.",
      },
    },
    blogList: {
      hero: {
        eyebrow: "TCG Finder Japan",
        title: {
          line1: "Blog &",
          line2: "Insights",
        },
        description:
          "Trading card news, store guides, market analysis, and community updates from across Japan.",
      },
      stats: {
        articles: "Articles",
      },
      grid: {
        ariaLabel: "Article listing",
        emptyMessage:
          "New articles on trading cards, store guides, and market insights are on their way.",
        noArticlesYet: "No Articles Yet.",
      },
    },
    blogArticle: {
      hero: {
        backToArticles: "Back to Articles",
        protected: "Protected",
        published: "Published",
      },
      breadcrumb: {
        articles: "Articles",
      },

      tags: {
        title: "Tags",
      },
    },
    blogArticlesTable: {
      noArticlesFound: "No articles found",
      createFirstArticle: "Create your first article.",

      article: "Article",
      category: "Category",
      status: "Status",
      published: "Published",
      actions: "Actions",

      publishedStatus: "Published",
      draftStatus: "Draft",

      viewArticle: "View Article",
      edit: "Edit",
      delete: "Delete",
      view: "View",

      deleteArticle: "Delete Article",
      deleteConfirm: "Are you sure you want to delete this article?",
      cannotUndo: "This action cannot be undone.",

      cancel: "Cancel",

      deleteFailed: "Failed to delete article",
      deleteSuccess: "Article deleted successfully",

      publishedLabel: "Published:",
    },
    articleForm: {
      title: {
        create: "Create Article",
        edit: "Edit Article",
      },

      description: {
        create: "Write and publish a new blog or column article.",
        edit: "Update the article details below.",
      },

      sections: {
        basicInformation: "Basic Information",
        thumbnail: "Thumbnail",
        content: "Content",
        category: "Category",
        tags: "Tags",
        accessProtection: "Access Protection",
      },

      labels: {
        title: "Title",
        slug: "Slug",
        excerpt: "Excerpt",
        articleBody: "Article Body",
        category: "Category",
        tags: "Tags",
        password: "Password",
        newPassword: "New Password",
        protectedArticle: "Password Protected Article",
      },

      placeholders: {
        title: "e.g. Pokemon Card Investment Guide",
        slug: "pokemon-card-investment-guide",
        excerpt: "A short summary of the article shown in listings...",
        content: "Write your article content here...",
        password: "Enter a secure password...",
        searchCategories: "Search categories...",
        searchTags: "Search tags...",
      },

      messages: {
        slugHelper: "Auto-generated from the title. You can edit it manually.",
        thumbnailUpload: "Click to upload thumbnail",
        thumbnailFormats: "PNG, JPG, WEBP supported",
        passwordProtected:
          "Readers must enter a password to view this article.",
        passwordAlreadySet: "A password is already set for this article.",
        passwordStorage:
          "Passwords are hashed before storage and never exposed in plain text.",
        noCategories: "No categories found.",
        noTags: "No tags found.",
      },

      thumbnail: {
        replace: "Replace",
        remove: "Remove thumbnail",
        notSaved: "Not yet saved",
        previewAlt: "Thumbnail preview",
      },

      tagsSelector: {
        select: "Select tags",
        selected: "tag selected",
        selectedPlural: "tags selected",
        remove: "Remove",
      },

      categorySelector: {
        select: "Select category",
      },

      protection: {
        changePassword: "Change Password",
        cancelPasswordChange: "Cancel",
        showPassword: "Show password",
        hidePassword: "Hide password",
      },

      validation: {
        titleRequired: "Title is required.",
        slugRequired: "Slug is required.",
        excerptRequired: "Excerpt is required.",
        contentRequired: "Content is required.",
        categoryRequired: "Category is required.",
        passwordRequired: "Password is required for protected articles.",
      },

      actions: {
        cancel: "Cancel",
        saveDraft: "Save Draft",
        savingDraft: "Saving...",
        publish: "Publish",
        publishing: "Publishing...",
        update: "Update",
        updating: "Updating...",
      },

      toast: {
        publishSuccess: "Article published successfully.",
        draftSuccess: "Article saved as draft.",
        updateSuccess: "Article updated successfully.",
        saveError: "Failed to save article. Please try again.",
        genericError: "Something went wrong.",
        thumbnailUploadError: "Thumbnail upload failed.",
      },

      dynamic: {
        tagsSelected: (count: number) =>
          `${count} tag${count > 1 ? "s" : ""} selected`,
      },
    },
  },

  jp: {
    appName: "TCG Finder Japan",
    navbar: {
      home: "ホーム",
      ranking: "ランキング",
      contact: "お問い合わせ",
      blog: "ブログ",
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
        shopVideo: "ショップ動画",
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
        articles: "記事",
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
          area: "エリア",
          longitude: "経度",
          closed: "休業",
          x_account_url: "X（旧Twitter）アカウントURL",
          language: "対応言語",
          description: "説明",
          shopIcon: "店舗アイコン",
          uploadIcon: "アイコンをアップロード",
          iconHint:
            "正方形の画像を推奨します。PNG、JPG、WebP形式に対応しています。",
          removeIcon: "アイコンを削除",
          changeIcon: "アイコンを変更",
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
            pokémon: "ポケモン",
            onepiece: "ワンピース",
            dragonball: "ドラゴンボール",
            cashonly: "現金のみ",
            cardsaccepted: "カード決済対応",
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
    privacy: {
      title: "プライバシーポリシー",

      intro:
        "TCG Finder Japan（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。",

      sections: {
        collect: {
          title: "1. 収集する情報",
          desc: "当サービスでは、お問い合わせ時のメールアドレスなどの個人情報や、閲覧したページ、操作履歴などの利用データを収集する場合があります。",
        },

        usage: {
          title: "2. 情報の利用目的",
          desc: "収集した情報は、お問い合わせへの回答、サービスの改善、ユーザー体験の向上、および機能の維持のために利用されます。",
        },

        ads: {
          title: "3. 広告の配信について（Google AdSense）",

          desc1:
            "当サービスでは、第三者配信の広告サービス「Google AdSense」を利用しています。",

          desc2:
            "Googleなどの第三者配信事業者は、Cookie（クッキー）を使用して、ユーザーが当サービスや他のウェブサイトに過去にアクセスした際の情報に基づき、適切な広告を配信します。",

          desc3:
            "Googleが広告配信にCookieを使用することにより、Googleやそのパートナーは、ユーザーが当サービスや他のサイトにアクセスした際の情報に基づいて、適切な広告をユーザーに表示できます。",
          desc4:
            "ユーザーは、Google広告設定でパーソナライズ広告を無効にできます。また、www.aboutads.info にアクセスすることで、第三者配信事業者がパーソナライズ広告の掲載で使用するCookieを無効にできます。",
          // link: "https://www.aboutads.info/",
        },

        analytics: {
          title: "4. アクセス解析ツールについて",
          desc: "当サービスでは、サイトの利用状況を把握するためにGoogleによるアクセス解析ツール「Googleアナリティクス」を利用しています。このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。このトラフィックデータは匿名で収集されており、個人を特定するものではありません。",
        },

        thirdParty: {
          title: "5. 第三者サービス",
          desc: "当サービスでは、Google Maps API等の第三者サービスを利用しており、匿名の利用データが収集される場合があります。",
        },

        protection: {
          title: "6. データの保護",
          desc: "当サービスは、ユーザー情報を保護するために適切な対策を講じていますが、完全な安全性を保証するものではありません。",
        },

        disclaimer: {
          title: "7. 免責事項",
          desc: "当サービスに掲載されている情報の正確性には万全を期していますが、利用者が本サービスの情報を用いて行う一切の行為について責任を負いません。また、TCG在庫や価格は常に変動するため、最終情報は各店舗にてご確認ください。",
        },

        changes: {
          title: "8. ポリシーの変更",
          desc: "本ポリシーは必要に応じて変更される場合があります。変更後は本ページに掲載した時点より効力を生じるものとします。",
        },
      },
    },
    about: {
      title: "当サイトについて",

      subtitle: "TCG Finder Japanについての運営情報ページです。",

      operatorLabel: "運営者:",
      operator: "TCG Finder Japan 運営事務局",

      websiteLabel: "サイトURL:",

      purposeLabel: "目的:",
      purpose:
        "当サイトは、日本国内のトレーディングカードゲーム（TCG）ショップ情報を集約し、特に海外から日本を訪れるコレクターやプレイヤーが、目当てのカードショップへ迷わず辿り着けるようサポートすることを目的としています。",

      activitiesLabel: "活動内容:",
      activities:
        "日本各地のTCGショップの所在地、取り扱いカード種別（Pokémon, One Piece等）、PSA鑑定品や未開封BOXの販売状況などを地図上で分かりやすく提供しています。情報は可能な限り最新の状態を保つよう努めております。",

      contactLabel: "お問い合わせ:",
      contactButton: "お問い合わせフォームはこちら",
      contactDesc:
        "当サイトに関するご意見、情報の修正依頼、広告掲載などのお問い合わせは、以下の[お問い合わせフォーム]よりご連絡ください。",

      disclaimerLabel: "免責事項:",
      disclaimer:
        // "掲載情報は細心の注意を払っておりますが、店舗の移転や営業時間変更などにより現状と異なる場合があります。最新の情報は各店舗の公式サイトやSNSをご確認ください。",
        "掲載情報は細心の注意を払っておりますが、店舗の移転や営業時間変更などにより現状と異なる場合があります。最新の情報は各店舗の公式サイトやSNSを併せてご確認ください。",
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
        about: "当サイトについて",
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
    passwordGate: {
      protectedArticle: "限定記事",
      description:
        "この記事を閲覧するにはパスワードが必要です。下記にパスワードを入力してください。",

      passwordLabel: "パスワード",
      passwordPlaceholder: "パスワードを入力してください",

      hidePassword: "パスワードを非表示",
      showPassword: "パスワードを表示",

      incorrectPassword:
        "パスワードが正しくありません。もう一度お試しください。",
      somethingWentWrong: "問題が発生しました。もう一度お試しください。",

      verifying: "認証中...",
      unlockArticle: "記事を閲覧する",

      footerText: "パスワードは購入後に提供されます。",
      needHelp: "お困りですか？",
    },
    blogCategory: {
      breadcrumb: {
        blog: "ブログ",
      },

      hero: {
        categoryLabel: "カテゴリー",
        articles: "記事",
        description:
          "{category}に関するカード情報、市場動向、ショップガイド、コミュニティの最新情報をご覧いただけます。",
      },

      stats: {
        articles: "記事",
      },

      grid: {
        emptyMessage:
          "{category}に関する公開記事はまだありません。しばらくしてから再度ご確認ください。",
      },
    },
    blogTag: {
      breadcrumb: {
        blog: "ブログ",
        tag: "タグ",
      },

      hero: {
        label: "タグ",
        articles: "記事",
        description: "{tag}タグが付けられた記事一覧です。",
      },

      stats: {
        articles: "記事",
      },

      grid: {
        emptyMessage:
          "{tag}タグの記事はまだありません。しばらくしてから再度ご確認ください。",
      },
    },
    blogList: {
      hero: {
        eyebrow: "TCG Finder Japan",

        title: {
          line1: "ブログ＆",
          line2: "インサイト",
        },

        description:
          "日本全国のトレーディングカードニュース、ショップガイド、市場分析、コミュニティ情報をご覧いただけます。",
      },

      stats: {
        articles: "記事",
      },

      grid: {
        noArticlesYet: "まだ記事がありません",
        emptyMessage:
          "トレーディングカード情報、ショップガイド、市場分析の記事を準備中です。",
      },
    },
    blogArticle: {
      hero: {
        backToArticles: "記事一覧へ戻る",
        protected: "保護記事",
        published: "公開日",
      },

      breadcrumb: {
        articles: "記事一覧",
      },

      tags: {
        title: "タグ",
      },
    },
    blogArticlesTable: {
      noArticlesFound: "記事が見つかりません",
      createFirstArticle: "最初の記事を作成してください。",

      article: "記事",
      category: "カテゴリー",
      status: "ステータス",
      published: "公開日",
      actions: "操作",

      publishedStatus: "公開中",
      draftStatus: "下書き",

      viewArticle: "記事を見る",
      edit: "編集",
      delete: "削除",
      view: "表示",

      deleteArticle: "記事を削除",
      deleteConfirm: "この記事を削除してもよろしいですか？",
      cannotUndo: "この操作は元に戻せません。",

      cancel: "キャンセル",

      deleteFailed: "記事の削除に失敗しました",
      deleteSuccess: "記事を削除しました",

      publishedLabel: "公開日:",
    },
    articleForm: {
      title: {
        create: "記事を作成",
        edit: "記事を編集",
      },

      description: {
        create: "新しいブログ記事やコラム記事を作成・公開します。",
        edit: "記事の内容を更新します。",
      },

      sections: {
        basicInformation: "基本情報",
        thumbnail: "サムネイル",
        content: "本文",
        category: "カテゴリー",
        tags: "タグ",
        accessProtection: "アクセス保護",
      },

      labels: {
        title: "タイトル",
        slug: "スラッグ",
        excerpt: "概要",
        articleBody: "記事本文",
        category: "カテゴリー",
        tags: "タグ",
        password: "パスワード",
        newPassword: "新しいパスワード",
        protectedArticle: "パスワード保護記事",
      },

      placeholders: {
        title: "例: ポケモンカード投資ガイド",
        slug: "pokemon-card-investment-guide",
        excerpt: "記事一覧に表示される短い説明を入力してください...",
        content: "記事本文を入力してください...",
        password: "安全なパスワードを入力してください...",
        searchCategories: "カテゴリーを検索...",
        searchTags: "タグを検索...",
      },

      messages: {
        slugHelper:
          "タイトルから自動生成されます。手動で編集することもできます。",
        thumbnailUpload: "クリックしてサムネイルをアップロード",
        thumbnailFormats: "PNG、JPG、WEBP対応",
        passwordProtected:
          "読者は記事を閲覧するためにパスワードの入力が必要です。",
        passwordAlreadySet: "この記事には既にパスワードが設定されています。",
        passwordStorage:
          "パスワードはハッシュ化して保存され、平文では保存されません。",
        noCategories: "カテゴリーが見つかりません。",
        noTags: "タグが見つかりません。",
      },

      thumbnail: {
        replace: "変更",
        remove: "サムネイルを削除",
        notSaved: "未保存",
        previewAlt: "サムネイルプレビュー",
      },

      tagsSelector: {
        select: "タグを選択",
        selected: "件のタグを選択中",
        selectedPlural: "件のタグを選択中",
        remove: "削除",
      },

      categorySelector: {
        select: "カテゴリーを選択",
      },

      protection: {
        changePassword: "パスワードを変更",
        cancelPasswordChange: "キャンセル",
        showPassword: "パスワードを表示",
        hidePassword: "パスワードを非表示",
      },

      validation: {
        titleRequired: "タイトルは必須です。",
        slugRequired: "スラッグは必須です。",
        excerptRequired: "概要は必須です。",
        contentRequired: "本文は必須です。",
        categoryRequired: "カテゴリーは必須です。",
        passwordRequired: "保護された記事にはパスワードが必要です。",
      },

      actions: {
        cancel: "キャンセル",
        saveDraft: "下書き保存",
        savingDraft: "保存中...",
        publish: "公開",
        publishing: "公開中...",
        update: "更新",
        updating: "更新中...",
      },

      toast: {
        publishSuccess: "記事を公開しました。",
        draftSuccess: "記事を下書きとして保存しました。",
        updateSuccess: "記事を更新しました。",
        saveError: "記事の保存に失敗しました。もう一度お試しください。",
        genericError: "エラーが発生しました。",
        thumbnailUploadError: "サムネイルのアップロードに失敗しました。",
      },

      dynamic: {
        tagsSelected: (count: number) => `${count}件のタグを選択中`,
      },
    },
  },
};
