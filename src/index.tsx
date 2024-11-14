import React from 'react'
import ReactDOM from 'react-dom'

function App() {
  return (
    <div>
      <header>
        <div>Kanban Board</div>

        <input placeholder="Filter Cards" />
      </header>

      <div>
        <section>
          <h3>Todo</h3>

          <article>朝食をとる🍞</article>
           <article>SNSをチェックする🐦</article>
           <article>布団に入る</article>
        </section>

        <section>
          <h3>Doing</h3>

          <article>顔を洗う</article>
          <article>歯を磨く</article>
        </section>

        <section>
          <h3>Waiting</h3>
        </section>

        <section>
          <h3>Done</h3>

          <article>布団から出る</article>
        </section>
      </div>
    </div>    
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
