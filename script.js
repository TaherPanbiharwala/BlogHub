// Global variable for blog posts
let blogPosts = [];

// DOM Elements
const blogPostsContainer = document.getElementById('blog-posts-container');
const blogListSection = document.getElementById('blog-list');
const blogPostSection = document.getElementById('blog-post');
const aboutSection = document.getElementById('about');
const contactSection = document.getElementById('contact');
const postContent = document.getElementById('post-content');
const backButton = document.getElementById('back-button');
const homeLink = document.getElementById('home-link');
const aboutLink = document.getElementById('about-link');
const contactLink = document.getElementById('contact-link');
const contactForm = document.getElementById('contact-form');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const signoutLink = document.getElementById('signout-link');
const savedLink = document.getElementById('saved-link');
const floatingAddBtn = document.getElementById('floating-add-btn');
const newPostContainer = document.getElementById('new-post-container');
const savedPostsSection = document.getElementById('saved-posts');
const savedPostsContainer = document.getElementById('saved-posts-container');

/* ========================
   Rendering & Fetching Posts
========================== */

// Render blog posts as cards (with like and bookmark icons)
// The title is clickable and styled as a larger blue heading.
function renderBlogPosts(posts = blogPosts) {
  const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  blogPostsContainer.innerHTML = '';
  const currentUser = firebase.auth().currentUser;

  sortedPosts.forEach(post => {
    // Check if current user liked/bookmarked this post
    let liked = currentUser && post.likedBy && post.likedBy.includes(currentUser.uid);
    let bookmarked = currentUser && post.savedBy && post.savedBy.includes(currentUser.uid);
    const heartIcon = `<span class="like-button ${liked ? 'liked' : ''}" data-post-id="${post.id}">&#9829;</span>`;
    const bookmarkIcon = `<span class="bookmark-button ${bookmarked ? 'bookmarked' : ''}" data-post-id="${post.id}">&#9733;</span>`;

    // Title is wrapped in an anchor for clickability
    const titleHTML = `<h3 class="blog-card-title">
                          <a href="#" data-slug="${post.slug}">${post.title}</a>
                        </h3>`;

    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-card-image" style="background-image: url('${post.coverImage || ''}')"></div>
      <div class="blog-card-content">
        <span class="blog-card-category">${post.section || ''}</span>
        ${titleHTML}
        <p class="blog-card-excerpt">${post.excerpt || ''}</p>
        <div class="blog-card-footer">
          <div class="blog-card-meta">
            <span class="blog-card-date">${new Date(post.createdAt).toLocaleString()}</span>
            <span class="blog-card-author">by ${post.username || 'Anonymous'}</span>
          </div>
          <div class="blog-card-actions">
            ${heartIcon}
            ${bookmarkIcon}
          </div>
        </div>
      </div>
    `;
    blogPostsContainer.appendChild(blogCard);
  });

  // Attach events for like buttons
  document.querySelectorAll('.like-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const postId = this.getAttribute('data-post-id');
      toggleLike(postId, this);
    });
  });

  // Attach events for bookmark buttons
  document.querySelectorAll('.bookmark-button').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const postId = this.getAttribute('data-post-id');
      toggleBookmark(postId, this);
    });
  });

  // Title anchors open the post
  document.querySelectorAll('.blog-card-title a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = this.getAttribute('data-slug');
      showBlogPost(slug);
    });
  });
}

// Render saved (bookmarked) posts in the "Saved Posts" section
function renderSavedPosts(posts) {
  savedPostsContainer.innerHTML = '';
  posts.forEach(post => {
    const blogCard = document.createElement('div');
    blogCard.className = 'blog-card';
    blogCard.innerHTML = `
      <div class="blog-card-image" style="background-image: url('${post.coverImage || ''}')"></div>
      <div class="blog-card-content">
        <span class="blog-card-category">${post.section || ''}</span>
        <h3 class="blog-card-title">
          <a href="#" data-slug="${post.slug}">${post.title}</a>
        </h3>
        <p class="blog-card-excerpt">${post.excerpt || ''}</p>
        <div class="blog-card-footer">
          <div class="blog-card-meta">
            <span class="blog-card-date">${new Date(post.createdAt).toLocaleString()}</span>
            <span class="blog-card-author">by ${post.username || 'Anonymous'}</span>
          </div>
        </div>
      </div>
    `;
    savedPostsContainer.appendChild(blogCard);
  });
  // Attach click events for titles in saved posts
  document.querySelectorAll('#saved-posts .blog-card-title a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = this.getAttribute('data-slug');
      showBlogPost(slug);
    });
  });
}

// Toggle like functionality for a post
function toggleLike(postId, likeBtnElement) {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("Please log in to like posts.");
    window.location.href = "login.html";
    return;
  }
  const postRef = db.collection("blogPosts").doc(postId);
  postRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      let likedBy = data.likedBy || [];
      let updateData = {};
      if (likedBy.includes(currentUser.uid)) {
        updateData = {
          likedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
          likes: firebase.firestore.FieldValue.increment(-1)
        };
      } else {
        updateData = {
          likedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
          likes: firebase.firestore.FieldValue.increment(1)
        };
      }
      postRef.update(updateData)
        .then(() => {
          // Update button style (this is a basic toggle; you may want to refresh the post data)
          if (likedBy.includes(currentUser.uid)) {
            likeBtnElement.classList.remove('liked');
          } else {
            likeBtnElement.classList.add('liked');
          }
        })
        .catch(error => {
          console.error("Error updating like:", error);
        });
    }
  }).catch(error => {
    console.error("Error fetching post data:", error);
  });
}

// Toggle bookmark functionality for a post
function toggleBookmark(postId, bookmarkBtnElement) {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    alert("Please log in to save posts.");
    window.location.href = "login.html";
    return;
  }
  const postRef = db.collection("blogPosts").doc(postId);
  postRef.get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      let savedBy = data.savedBy || [];
      let updateData = {};
      if (savedBy.includes(currentUser.uid)) {
        updateData = {
          savedBy: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
        };
      } else {
        updateData = {
          savedBy: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
        };
      }
      postRef.update(updateData)
        .then(() => {
          if (savedBy.includes(currentUser.uid)) {
            bookmarkBtnElement.classList.remove('bookmarked');
          } else {
            bookmarkBtnElement.classList.add('bookmarked');
          }
        })
        .catch(error => {
          console.error("Error updating bookmark:", error);
        });
    }
  }).catch(error => {
    console.error("Error fetching post data:", error);
  });
}

// Fetch posts from Firestore in real time
function fetchBlogPosts() {
  db.collection("blogPosts").orderBy("createdAt", "desc")
    .onSnapshot(snapshot => {
      blogPosts = [];
      snapshot.forEach(doc => {
        let post = doc.data();
        post.id = doc.id;
        blogPosts.push(post);
      });
      renderBlogPosts();
    }, error => {
      console.error("Error fetching blog posts:", error);
    });
}

/* ========================
   Single Post, Edit & Comment Section
========================== */

// Show single blog post view (includes comment section)
function showBlogPost(slug) {
  const post = blogPosts.find(post => post.slug === slug);
  if (post) {
    let html = `
      <div class="post-header">
        <h1 class="post-title">${post.title}</h1>
        <div class="post-meta">
          <span class="post-date">Posted on: ${new Date(post.createdAt).toLocaleString()}</span>
          <span class="post-author">by ${post.username || 'Anonymous'}</span>
          ${ post.updatedAt && post.updatedAt !== post.createdAt ? `<span class="post-edited">Edited on: ${new Date(post.updatedAt).toLocaleString()}</span>` : '' }
        </div>
      </div>
      <div class="post-body">${post.content}</div>
      <div id="comments-section">
        <h2>Comments</h2>
        <div id="comments-container">
          <!-- Comments will appear here -->
        </div>
        <div id="comment-form-container">
          <!-- Comment form will be injected if user is logged in -->
        </div>
      </div>
    `;
    const currentUser = firebase.auth().currentUser;
    if (currentUser && post.userId === currentUser.uid) {
      html += `<button id="edit-post-btn">Edit</button>`;
    }
    postContent.innerHTML = html;
    showSection(blogPostSection);

    // Attach edit event if applicable
    const editBtn = document.getElementById('edit-post-btn');
    if (editBtn) {
      editBtn.addEventListener('click', function() {
        openEditForm(post);
      });
    }

    // Fetch and render comments for this post
    fetchComments(post.id);

    // If logged in, render comment form
    if (currentUser) {
      renderCommentForm(post.id);
    }
  }
}

// Open an edit form for the post
function openEditForm(post) {
  let editFormContainer = document.getElementById('edit-form-container');
  if (!editFormContainer) {
    editFormContainer = document.createElement('div');
    editFormContainer.id = 'edit-form-container';
    postContent.appendChild(editFormContainer);
  }
  editFormContainer.innerHTML = `
    <h2>Edit Blog Post</h2>
    <form id="edit-post-form">
      <div class="form-group">
        <label for="edit-post-title">Title</label>
        <input type="text" id="edit-post-title" value="${post.title}" required>
      </div>
      <div class="form-group">
        <label for="edit-post-excerpt">Excerpt</label>
        <textarea id="edit-post-excerpt" required>${post.excerpt || ''}</textarea>
      </div>
      <div class="form-group">
        <label for="edit-post-content">Main Body</label>
        <textarea id="edit-post-content" required>${post.content}</textarea>
      </div>
      <div class="form-group">
        <label for="edit-post-tags">Tags (comma separated)</label>
        <input type="text" id="edit-post-tags" value="${post.tags ? post.tags.join(', ') : ''}">
      </div>
      <div class="form-group">
        <label for="edit-post-section">Section</label>
        <input type="text" id="edit-post-section" value="${post.section}" required>
      </div>
      <div class="form-group">
        <label for="edit-post-image">Image URL</label>
        <input type="url" id="edit-post-image" value="${post.coverImage || ''}">
      </div>
      <button type="submit">Update Post</button>
    </form>
  `;
  document.getElementById('edit-post-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const updatedPost = {
      title: document.getElementById('edit-post-title').value,
      excerpt: document.getElementById('edit-post-excerpt').value,
      content: document.getElementById('edit-post-content').value,
      tags: document.getElementById('edit-post-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
      section: document.getElementById('edit-post-section').value,
      coverImage: document.getElementById('edit-post-image').value,
      updatedAt: new Date().toISOString()
    };
    db.collection('blogPosts').doc(post.id).update(updatedPost)
      .then(() => {
         alert("Post updated successfully!");
         editFormContainer.remove();
      })
      .catch(error => {
         console.error("Error updating post:", error);
         alert("Error updating post: " + error.message);
      });
  });
}

// Fetch comments for a given post
function fetchComments(postId) {
  const commentsContainer = document.getElementById('comments-container');
  commentsContainer.innerHTML = '';
  
  db.collection("blogPosts").doc(postId).collection("comments")
    .orderBy("createdAt", "asc")
    .onSnapshot(snapshot => {
      let comments = [];
      snapshot.forEach(doc => {
        let comment = doc.data();
        comment.id = doc.id;
        comments.push(comment);
      });
      renderComments(comments);
    }, error => {
      console.error("Error fetching comments:", error);
    });
}

// Render comments in the comments container
function renderComments(comments) {
  const commentsContainer = document.getElementById('comments-container');
  commentsContainer.innerHTML = '';
  comments.forEach(comment => {
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    commentDiv.innerHTML = `
      <div class="comment-header">
        <span class="comment-author">${comment.username || 'Anonymous'}</span>
        <span class="comment-date">${new Date(comment.createdAt).toLocaleString()}</span>
      </div>
      <div class="comment-body">
        <p>${comment.text}</p>
      </div>
    `;
    commentsContainer.appendChild(commentDiv);
  });
}

// Render the comment form for a post


/* ========================
   Utility Functions
========================== */

// Show/hide sections
function showSection(sectionToShow) {
  const sections = [blogListSection, blogPostSection, aboutSection, contactSection, savedPostsSection];
  sections.forEach(section => {
    section.classList.remove('active-section');
    section.classList.add('hidden-section');
  });
  sectionToShow.classList.remove('hidden-section');
  sectionToShow.classList.add('active-section');
  window.scrollTo(0, 0);
}

// Set active navigation link
function setActiveNavLink(activeLink) {
  [homeLink, aboutLink, contactLink, savedLink].forEach(link => link.classList.remove('active'));
  activeLink.classList.add('active');
}

/* ========================
   Saved Posts Functionality
========================== */

// Fetch bookmarked posts for the current user
function fetchBookmarkedPosts() {
  const currentUser = firebase.auth().currentUser;
  if (!currentUser) return;
  db.collection("blogPosts")
    .where("savedBy", "array-contains", currentUser.uid)
    .orderBy("createdAt", "desc")
    .get()
    .then(snapshot => {
      let bookmarkedPosts = [];
      snapshot.forEach(doc => {
        let post = doc.data();
        post.id = doc.id;
        bookmarkedPosts.push(post);
      });
      console.log("Bookmarked posts fetched:", bookmarkedPosts);
      renderSavedPosts(bookmarkedPosts);
    })
    .catch(error => {
      console.error("Error fetching bookmarked posts:", error);
      // If an index is required, follow the link provided in the console error.
    });
}

/* ========================
   Event Listeners & UI Interactions
========================== */

function setupEventListeners() {
  // Delegate clicks on read-more (if any) to show single post view
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more')) {
      e.preventDefault();
      const slug = e.target.getAttribute('data-slug');
      showBlogPost(slug);
    }
  });
  
  // Back button
  backButton.addEventListener('click', function() {
    showSection(blogListSection);
    setActiveNavLink(homeLink);
  });

  // Navigation links
  homeLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(blogListSection);
    setActiveNavLink(homeLink);
  });
  
  aboutLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(aboutSection);
    setActiveNavLink(aboutLink);
  });
  
  contactLink.addEventListener('click', function(e) {
    e.preventDefault();
    showSection(contactSection);
    setActiveNavLink(contactLink);
  });

  // Saved Posts link
  savedLink.addEventListener('click', function(e) {
    e.preventDefault();
    fetchBookmarkedPosts();
    showSection(savedPostsSection);
    setActiveNavLink(savedLink);
  });

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! This would be sent to a server in a real application.');
    contactForm.reset();
  });

  // Sign Out event listener
  signoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      alert("You have signed out.");
      window.location.href = "index.html";
    }).catch(error => {
      console.error("Error signing out:", error);
    });
  });

  // Floating + button event to show new post form
  floatingAddBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleNewPostForm();
  });
}

// Function to show/hide the new post form
function toggleNewPostForm() {
  let newPostForm = document.getElementById('new-post-form');
  if (newPostForm) {
    newPostForm.remove();
  } else {
    newPostForm = document.createElement('div');
    newPostForm.id = 'new-post-form';
    newPostForm.innerHTML = `
      <h2>Add New Blog Post</h2>
      <form id="post-form">
        <div class="form-group">
          <label for="post-title">Title</label>
          <input type="text" id="post-title" required>
        </div>
        <div class="form-group">
          <label for="post-excerpt">Excerpt</label>
          <textarea id="post-excerpt" required></textarea>
        </div>
        <div class="form-group">
          <label for="post-content">Main Body</label>
          <textarea id="post-content-input" required></textarea>
        </div>
        <div class="form-group">
          <label for="post-tags">Tags (comma separated)</label>
          <input type="text" id="post-tags">
        </div>
        <div class="form-group">
          <label for="post-section">Section</label>
          <input type="text" id="post-section" placeholder="e.g., Technology, Sports" required>
        </div>
        <div class="form-group">
          <label for="post-image">Image URL</label>
          <input type="url" id="post-image">
        </div>
        <button type="submit">Post Blog</button>
      </form>
    `;
    newPostContainer.appendChild(newPostForm);

    // Event listener for the new post form submission
    document.getElementById('post-form').addEventListener('submit', function(e) {
      e.preventDefault();
      const title = document.getElementById('post-title').value;
      const excerpt = document.getElementById('post-excerpt').value;
      const content = document.getElementById('post-content-input').value;
      const tagsStr = document.getElementById('post-tags').value;
      const section = document.getElementById('post-section').value;
      const image = document.getElementById('post-image').value;
      
      const tags = tagsStr.split(',').map(tag => tag.trim()).filter(tag => tag);
      const newPost = {
        title: title,
        slug: title.toLowerCase().replace(/\s+/g, '-'),
        excerpt: excerpt,
        content: content,
        tags: tags,
        section: section,
        coverImage: image,
        createdAt: new Date().toISOString()
      };

      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        db.collection('users').doc(currentUser.uid).get()
          .then(doc => {
            if (doc.exists) {
              newPost.username = doc.data().username;
              newPost.userId = currentUser.uid;
              db.collection('blogPosts').add(newPost)
                .then(() => {
                  alert("Blog post added successfully!");
                  document.getElementById('post-form').reset();
                  newPostForm.remove();
                })
                .catch(error => {
                  console.error("Error adding blog post:", error);
                  alert("Error adding blog post: " + error.message);
                });
            } else {
              alert("User data not found.");
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
          });
      } else {
        alert("You must be signed in to post a blog.");
      }
    });
  }
}

/* ========================
   Auth State & Initialization
========================== */

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    signoutLink.style.display = 'inline';
    floatingAddBtn.style.display = 'inline';
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
    savedLink.style.display = 'inline';
  } else {
    signoutLink.style.display = 'none';
    floatingAddBtn.style.display = 'none';
    loginLink.style.display = 'inline';
    signupLink.style.display = 'inline';
    savedLink.style.display = 'none';
    let newPostForm = document.getElementById('new-post-form');
    if (newPostForm) {
      newPostForm.remove();
    }
  }
});

// Initialize the blog: set up event listeners and start fetching posts
function initBlog() {
  setupEventListeners();
  fetchBlogPosts();
}

document.addEventListener('DOMContentLoaded', initBlog);