import { view, set, Chain, chain } from "../index"

interface User {
  email: string
  age: number
  github: {
    url: string
  }
}

const sampleUser: User = {
  email: "john.doe@example.com",
  age: 42,
  github: {
    url: "https://github.com/john.doe"
  }
}

describe("Lens", () => {
  let user: User

  beforeEach(() => {
    user = sampleUser
  })

  describe("one level", () => {
    it("allows reading", () => {
      const email: string = view("email")(user)
      const age: number = view("age")(user)

      expect(email).toEqual("john.doe@example.com")
      expect(age).toEqual(42)
    })

    it("allows writing", () => {
      const updatedUser: User = set("email")(user, "bruce.wayne@example.com")
      expect(updatedUser.email).toEqual("bruce.wayne@example.com")
    })
  })

  describe("multiple levels using chaining", () => {
    const getUser = () => user
    const setUser = (value: User): void => { user = value }

    const root: Chain<User> = {
      view: getUser,
      set: setUser
    }

    const emailLens: Chain<string> = chain("email")(root)
    const ageLens: Chain<number> = chain("age")(root)
    const githubLens: Chain<{ url: string }> = chain("github")(root)
    const githubUrlLens: Chain<string> = chain("url")(githubLens)

    it("allows reading", () => {
      expect(emailLens.view()).toEqual("john.doe@example.com")
      expect(ageLens.view()).toEqual(42)
      expect(githubUrlLens.view()).toEqual("https://github.com/john.doe")
    })

    it("allows writing", () => {
      emailLens.set("bruce.wayne@example.com")
      ageLens.set(100)
      githubUrlLens.set("https://github.com/batman")

      expect(user).toEqual({
        email: "bruce.wayne@example.com",
        age: 100,
        github: {
          url: "https://github.com/batman"
        }
      })
    })
  })
})
