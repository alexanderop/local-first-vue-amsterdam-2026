---
theme: ./
layout: cover
---

# @alexop/slidev-theme-brand

A modern dark theme with pink accent

---

# Slide Title

Slide Subtitle

* Slide bullet text
  * Slide bullet text
  * Slide bullet text
* Slide bullet text
* Slide bullet text

---
layout: two-cols
---

# Two Columns Layout

Content in left column

::right::

Content in right column

* Bullet point 1
* Bullet point 2
* Bullet point 3

---
layout: section
---

# Section Title

---
layout: statement
---

# Statement

---
layout: fact
---

# 100%
Fact information

---
layout: quote
---

# "Notable quote"
Attribution

---
layout: center
---

# Centered Content

This layout centers everything

---

# Code Example

```ts {all|2|1-6|all}
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
```

---
layout: center
class: "text-center"
---

# Learn More

[Documentation](https://sli.dev) / [GitHub](https://github.com/slidevjs/slidev)
