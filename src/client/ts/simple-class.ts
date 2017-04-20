class SimpleClass {
  constructor(private variable: number) { }

  get incrementedVariable(): number {
    return this.variable + 1
  }

}