var CourseSelection = React.createClass({
  getInitialState: function() {

    if(window.location.search.length <= 0) return({ list: [] })
    parameters = {}
    window.location.search.substring(1).split('&').map(function(element) {
      token = element.split('=')
      parameters[token[0]] = token[1]
    })
    if(!parameters.data) return({ list: [] })
    try {
      var data = JSURL.parse(atob(parameters.data))
      return ({ list: data })
    } catch(e) {
      return({ parseError: true, list: [] })
    }

  },
  isConflictCheck: function(list, course) {
    /* 檢查衝堂 */
    for(var i = 0; i < list.length; i++) {
      for(var j = 0; j < list[i].courseTime.length; j++)
      {
        if (course.courseTime.indexOf(list[i].courseTime[j]) >= 0) {
          $('#conflictCourse')
            .empty()
            .append('<p>欲加選的課程：<br/>')
            .append(course.courseTime.toString() + ' : ' + course.courseName)
            .append('</p><p>已與課表上下列課程時間重疊：<br/>')
            .append(list[i].courseTime.toString() + ' : ' + list[i].courseName)
            .append('</p>')
          ;

          $('.ui.modal.conflictWarning')
            .modal('show')
          ;
          return true
        }
      }
    }
    return false;
  },
  handleAddCourse: function(course, button) {
    var list = this.state.list;
    if(!this.isConflictCheck(list, course)) {
      list.push(course);
      this.setState({list: list});

      //button Animation
      setTimeout(function () {
        button
          .html('Added')
          .addClass('disabled')
        ;
      }, 600);
    }
    setTimeout(function () {
      button
        .removeClass('loading')
      ;
    }, 600);
  },
  handleDelete: function(uid) {
    this.setState({
      list: this.state.list.filter(function(element) {
        return element.courseUid != uid;
      })
    });
  },
  render: function() {
    return (
      <div id="CourseSelection">
        <div className="ui parseError warning message hidden">
          <i className="close icon"></i>
          <div className="header">
            網址解析失敗
          </div>
          <p>無法從網址讀取資料。因此課表將顯示為空白</p>
        </div>
        <div className="ui top attached secondary pointing menu">
          <a className="active item" data-tab="schedule">我的課表</a>
          <a className="item" data-tab="search">搜尋課程</a>
          <a className="item" data-tab="about">About</a>
        </div>
        <div className="ui bottom attached tab segment active content" data-tab="schedule">

          <CourseTable courseList={this.state.list} handleDelete={this.handleDelete} />
        </div>
        <div className="ui bottom attached tab segment" data-tab="search">

          <SearchCourse handleAddCourse={this.handleAddCourse}/>
        </div>

        <div className="ui bottom attached tab segment" data-tab="about">
          <h2 className="ui dividing header">
            關於
          </h2>
          <h3 className="ui header">作者</h3>
          <div className="ui list">
            <div className="item">
              <img className="ui avatar image" src="http://www.gravatar.com/avatar/7bc81b728640a4917ec3b6625d16425e" />
              <div className="content">
                <a className="header">Erickson Juang</a>
                <div className="description">資訊工程學系102級(104~)、電機工程學系101級(101~103)</div>
              </div>
            </div>
          </div>
          <h3 className="ui header">更新資訊</h3>
          <ul>

            <li>
              2015-12-09
              <ul>
                <li>更新為1042學期資料庫</li>
              </ul>
            </li>

            <li>

                2015-09-10

                <ul>

                  <li>
                      更新資料庫 （節戳時間為2015-09-09 22:38:53）
                  </li>

                  <li>
                      衝堂提醒增加列出衝堂課名與時間
                  </li>

                  <li>
                      課程資料增加上課地點
                  </li>

                  <li>
                      課表中顯示課號與上課地點
                  </li>

                  <li>
                      按下「Add」後，按鈕改為disabled
                  </li>

                  <li>
                      更改UI文字
                  </li>

                  <li>
                      統計已選學分數
                  </li>

                </ul>

            </li>


          </ul>

          <h3 className="ui header">注意事項</h3>
          <div className="ui bulleted list">
            <div className="item">
              課程資訊僅供參考，實際資訊請參閱
              <a href="https://portal.yzu.edu.tw/cosSelect/Index.aspx">
                元智大學課程查詢系統
              </a>
              。
            </div>
          </div>
          <h3 className="ui header">使用的Framework</h3>
          <div className="ui bulleted list">
            <div className="item">
              React 0.13.3
            </div>
            <div className="item">
              Semantic ui 2.0.8
            </div>
            <div className="item">
              jsurl.js
            </div>
            <div className="item">
              jQuery
            </div>
          </div>
          <h3 className="ui header">原始碼與授權</h3>
          <div className="ui list">
            <div className="ui items">
              <div className="item">
                <div className="ui mini image">
                  <i className="big github icon"></i>
                </div>
                <div className="content">
                  <div className="header">Source code on Github</div>
                  <div className="description">
                    <p>可以由Github上觀看source code</p>
                    <p><a href="https://github.com/erickson-makotoki/yzu-css">https://github.com/erickson-makotoki/yzu-css</a></p>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="ui mini image">
                  <i className="big code icon"></i>
                </div>
                <div className="content">
                  <div className="header">MIT 授權</div>
                  <div className="description">
                    <p>可參閱<a href="http://www.openfoundry.org/tw/licenses/34-mit-licensemit">http://www.openfoundry.org/tw/licenses/34-mit-licensemit</a></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="ui basic modal conflictWarning">
          <i className="close icon"></i>
          <div className="header">
            糟糕，衝堂了
          </div>
          <div className="image content">
            <div className="image">
              <i className="warning circle icon"></i>
            </div>
            <div className="description">
              <p>此課程開課時間，和你已經選的課有重疊喔！</p>
              <div id="conflictCourse">

              </div>
            </div>
          </div>
          <div className="actions">
              <div className="ui green basic inverted button">
                <i className="checkmark icon"></i>
                OK
              </div>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    $('.message.parseError.warning .close')
      .on('click', function() {
        $(this)
          .closest('.message')
          .transition('fade')
        ;
      })
    ;
    if(this.state.parseError)
      $('.message.parseError.warning')
        .show()
      ;
  }
});

var CourseTable = React.createClass({
  getInitialState: function () {
    return({
      day: 6,
      row: 13,
      label: {
        times: [
        '08:10-09:00', '09:10-10:00', '10:10-11:00', '11:10-12:00',
        '12:10-13:00', '13:10-14:00', '14:10-15:00', '15:10-16:00',
        '16:10-17:00', '17:10-18:00', '18:30-19:20', '19:30-20:20',
        '20:30-21:20'
        ],
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      creditCount: 0
    })
  },
  handleDaysChange: function(event) {
    if ( !event ) return false;
    this.setState({day: event});
  },
  handleLessonsChange: function(event) {
    if ( !event ) return false;
    this.setState({row: event});
  },
  handleDelete: function(uid) {
    this.props.handleDelete(uid)
  },
  refreshData: function(courseList) {

    var extendCourse = {}
    var creditCount = 0
    courseList.map(function(element) {
      creditCount += element.credit
      element.courseTime.map(function(value) {
        /* 若課表天數不夠，自動增加 */
        if( Math.floor(value / 100) > this.state.day ) {
          $('.dropdown.daysOption')
            .dropdown('set selected', Math.floor(value / 100))
          ;
        }
        /* 若課表節數不夠，自動增加 */
        if( value % 100 > this.state.row) {
          $('.dropdown.lessonsOption')
            .dropdown('set selected', value % 100)
          ;
        }
        extendCourse[Math.floor(value / 100 - 1).toString()] = extendCourse[Math.floor(value / 100 - 1).toString()] || {}
        extendCourse[Math.floor(value / 100 - 1).toString()][(value % 100 - 1).toString()] = element;
      }.bind(this));
    }.bind(this));
    this.setState({rawData: courseList, extendData: extendCourse, creditCount: creditCount});
  },
  componentWillReceiveProps: function(nextProps) {
    this.refreshData(nextProps.courseList);
  },
  componentWillMount: function() {
    this.refreshData(this.props.courseList);
  },
  render: function() {
    var daysOption = [5, 6].map(function(currentValue) {
      return (<option key={currentValue} value={currentValue}>{currentValue}</option>)
    }.bind(this));

    var lessonsOption = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(function(currentValue) {
      return (<option key={currentValue} value={currentValue}>{currentValue} ({this.state.label.times[currentValue - 1].split('-')[1]}結束)</option>)

    }.bind(this));

    /**
     * prepare table
     *
     */
    var thead;
    var tbody;
    var fields;
    /**
     * prepare thead
     * 先產生childern (Days)
     * 利用unshift補上開頭
     */
    fields = this.state.label.days.map(function(currentValue, index) {
      if(index + 1 > this.state.day) return null;
      return (<th key={index + 1} className="two wide center aligned">{currentValue}</th>)
    }.bind(this));
    fields.unshift(<th key={0} className="two wide" />)
    thead = (<thead><tr key={0}>{fields}</tr></thead>);

    /**
     * prepare tbody
     *
     */

    var rows = this.state.label.times.map(function (currentValue, RowIndex) {

      if(RowIndex + 1 > this.state.row) return null;
      /**
       * 這邊好玄喔....Apply的用法，先產生N個元素的空array
       * 接著透過map針對每個element填入資料
       * 參考自 http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
       * 最後利用unshift補上時間於row開頭
       */
      fields = Array.apply(null, Array(this.state.day)).map(function(element, index) {
        if(this.state.extendData && this.state.extendData[index.toString()] && this.state.extendData[index.toString()][RowIndex.toString()])
          return (<CourseTableDataField key={index + 1} course={this.state.extendData[index.toString()][RowIndex.toString()]} handleDelete={this.handleDelete} fieldKey={ (index + 1).toString() + ((RowIndex + 1) >= 10 ? (RowIndex + 1).toString() : '0' + (RowIndex + 1))} />)
        return (<CourseTableDataField key={index + 1} />)
      }.bind(this))
      fields.unshift(<td key={0} className="center aligned"><p key={0}>第 {RowIndex + 1} 節</p><p key={1}>{currentValue}</p></td>)
      return (<tr key={RowIndex + 1}>{fields}</tr>)

    }.bind(this))

    tbody = (<tbody>{rows}</tbody>)

    return (
      <div>
        <div className="ui form">
          <div className="three fields">
            <div className="field">
              <select defaultValue={this.state.day} className="ui dropdown daysOption">
                {daysOption}
              </select>
              <label>一週上課幾天？</label>
            </div>
            <div className="field">
              <select defaultValue={this.state.row} className="ui dropdown lessonsOption">
                {lessonsOption}
              </select>
              <label>一天最多幾節課？</label>
            </div>
            <div className="field">
              <div className="teal ui button generatingURL"
                onClick={this.generatingURL}
                data-content="匯出課表，下次可以由該網址繼續編輯。">產生網址</div>
            </div>
          </div>
        </div>
        <div className="ui green message">
          <p>已選學分數：{this.state.creditCount}</p>
          <p>一般生選課上限為25學分，符合資格者（如雙主修、輔系、跨學程領域等）上限為31學分</p>
          <p>大一～大三生選課下限至少16學分，大四生至少9學分</p>
        </div>


        <table id="CourseTable" className="ui definition table celled">
          {thead}
          {tbody}
        </table>


        <div className="ui modal basic generatingURL">
          <i className="close icon"></i>
          <div className="header">
            產生網址
          </div>
          <div className="ui input fluid">
            <input type="text" ref="url" readOnly />
            <a target="_blank" className="ui teal right labeled icon button" ref="url_button">
              <i className="linkify icon"></i>
              Open
            </a>
          </div>
        </div>
      </div>
    )
  },
  componentDidMount: function() {
    $('.ui.button')
      .popup({
        position: 'bottom center'
      })
    ;
    $('select.dropdown.daysOption')
      .dropdown({
        onChange: this.handleDaysChange
      })
    ;
    $('select.dropdown.lessonsOption')
      .dropdown({
        onChange: this.handleLessonsChange
      })
    ;

  },
  generatingURL: function() {
    var encode = btoa(JSURL.stringify(this.state.rawData))
    React.findDOMNode(this.refs.url).value = window.location.protocol + '//' + window.location.host + window.location.pathname + '?data=' + encode
    React.findDOMNode(this.refs.url_button).href = window.location.protocol + '//' + window.location.host + window.location.pathname + '?data=' + encode
    $('.modal.generatingURL')
      .modal('show')
    ;
  }
});


/**
 * Data Obj format: (column name)
 * course uid
 * Course Code
 * Course Name
 * Teacher Name
 * Time
 * Classroom
 * Class number (ex. A, B, C and etc.)
 * Credit
 */
var CourseTableDataField = React.createClass({
  render: function() {
    if(this.props.course) {
      return(
        <td>
          <div className="right aligned"><a href="#" onClick={this.handleDelete}><i className="close icon"></i></a></div>
          <p className="center aligned">
            {this.props.course.courseCode + ' ' + this.props.course.classNumber}
            <br/>
            {this.props.course.courseName}
            <br/>
            {this.props.course.teacherName}
            <br/>
            {this.props.course.classroom[this.props.fieldKey]}
          </p>
        </td>
      );
    } else {
      return( <td></td>)
    }
  },
  handleDelete: function() {
    this.props.handleDelete(this.props.course.courseUid);
  }
});

var SearchCourse = React.createClass({
  getInitialState: function() {
    $.ajax({
      url: 'database104-2.json',
      type: 'get',
      dataType: 'json'

    })
    .done(function(data, textStatus, jqXHR) {
      this.setState({courseData: data});
    }.bind(this))
    .fail(function(jqXHR, textStatus, errorThrown) {
    });

    return ( {
      degree: [1, 2, 3, 4],
      reslut: {}
    } )
  },
  handleSearchFormSubmit: function(keys) {
    var result = this.state.courseData.course;

    if(keys.department && keys.department != "0") {
      result = result.filter(function(element, index, array) {
        return element.department == keys.department;
      });
    }

    if(keys.degree && key.degree != "0") {
      result = result.filter(function(element, index, array) {
        return element.degree == keys.degree;
      });
    }

    if(keys.courseCode) {
      result = result.filter(function(element, index, array) {
        return element.code.indexOf(keys.courseCode) >= 0;
      });
    }

    if(keys.courseName) {
      result = result.filter(function (element, index, array) {
        return element.chinese_name.indexOf(keys.courseName) >= 0;
      });
    }

    if(keys.teacherName) {
      result = result.filter(function (element, index, array) {
        return element.teacher.indexOf(keys.teacherName) >= 0;
      });
    }

    this.setState({result: result});
  },
  handleCourseAdd: function(course, button) {
    /**
     * Data Obj format: (column name)
     * course uid
     * Course Code
     * Course Name
     * Teacher Name
     * Time
     * Classroom
     * Class number (ex. A, B, C and etc.)
     * Credit
     */

    //Pass to parent Node to add
    this.props.handleAddCourse({
      courseUid:course.uid,
      courseCode:course.code,
      courseName:course.chinese_name,
      teacherName:course.teacher,
      courseTime:course.time.split(',').map(function(element) { return parseInt(element) }),
      classroom:course.classroom,
      classNumber:course.class,
      credit:course.credit

    }, button)
  },
  render: function() {
    if (!this.state.courseData) return null;
    return (
      <div className="ui grid stackable">
        <div className="six wide column">
          <SearchForm degree={this.state.degree}
            department={this.state.courseData.department}
            updateTime={this.state.courseData.update}
            handleSubmit={this.handleSearchFormSubmit} />
        </div>

        <div className="ten wide column searchResult">
          <SearchResult result={this.state.result}
            handleAdd={this.handleCourseAdd} />
        </div>

      </div>
    )
  }
});

var SearchForm = React.createClass({
  getInitialState: function() {
    return({
      department: 0,
      degree: 0
    })
  },
  handleDepartmentChange: function(value) {
    if(value) this.setState({department: value});
  },
  handleGradeChange: function(value) {
    if(value) this.setState({degree: value});
  },
  handleReset: function() {
    $('form').removeClass('error');
    if(this.state.department != 0) {
      $('.dropdown.department')
        .dropdown('restore defaults')
      ;
    }

    if(this.state.degree != 0) {
      $('.dropdown.degree')
        .dropdown('restore defaults')
      ;
    }

  },
  handleSubmit: function(e) {
    $('form').removeClass('error');
    e.preventDefault();
    var keys = {
      department: this.state.department,
      degree: this.state.degree,
      courseCode: (React.findDOMNode(this.refs.courseCode).value.trim() || null),
      courseName: (React.findDOMNode(this.refs.courseName).value.trim() || null),
      teacherName: (React.findDOMNode(this.refs.teacherName).value.trim() || null)
    }

    if( keys.department != 0
       || keys.degree != 0
       || keys.courseCode
       || keys.courseName
       || keys.teacherName)
      this.props.handleSubmit(keys);
    else
      $('form').addClass('error');

    //reset all button
    $('button[class="ui green basic button disabled"]').html('Add');
    $('button[class="ui green basic button disabled"]').removeClass('disabled');
  },
  render: function() {
    var Department = this.props.department.map(function(element, index) {
      return (<option key={index + 1} value={element.departmentCode}>{element.departmentName}</option>)
    });
    Department.unshift(<option key={0} value={0}>請選擇 Please Select</option>)

    var Grade = this.props.degree.map(function(element, index) {
      return (<option key={index + 1} value={element}>{element}</option>)
    });
    Grade.unshift(<option key={0} value={0}>請選擇 Please Select</option>)

    return (
      <form className="ui form" onSubmit={this.handleSubmit}>
        <h2 className="ui dividing header">搜尋課程</h2>
          <div className="ui error message">
            <div className="header">缺少搜尋條件</div>
            <p>請至少指定一個搜尋條件，再進行搜尋。</p>
          </div>
          <div className="field">
            <label>開課系所 Department</label>
            <select defaultValue={this.state.department} className="ui dropdown search department">
              {Department}
            </select>
          </div>
          <div className="field">
            <label>選課年級 Grade</label>
            <select defaultValue={this.state.degree} className="ui dropdown degree">
              {Grade}
            </select>
          </div>
          <div className="field">
            <label>課號</label>
            <input type="text" placeholder="Course Code" ref="courseCode" />
          </div>
          <div className="field">
            <label>課程名稱</label>
            <input type="text" placeholder="Course Name" ref="courseName" />
          </div>
          <div className="field">
            <label>開課教師</label>
            <input type="text" placeholder="Teacher Name" ref="teacherName" />
          </div>
          <div className="field">
            <label>資料庫最後更新時間</label>{this.props.updateTime}
          </div>
          <div className="field right aligned">
            <div className="ui buttons">
              <button type="reset" className="ui button reset" onClick={this.handleReset}>Reset</button>
              <div className="or"></div>
              <button type="submit" className="ui positive button">Search</button>
            </div>
          </div>
      </form>
    )
  },
  componentDidMount: function() {
    $('select.dropdown.department')
      .dropdown({
        onChange: this.handleDepartmentChange
      })
    ;
    $('select.dropdown.degree')
      .dropdown({
        onChange: this.handleGradeChange
      })
    ;
  }
})

var SearchResult = React.createClass({
  handleAdd: function(course) {
    var addButton = $(React.findDOMNode(this.refs['result-' + course.uid]));
    //load Animation
    addButton.addClass('loading');
    //pass to parent Node
    this.props.handleAdd(course, addButton);
  },
  render: function() {
    if(!this.props.result) return null;

    if(this.props.result.length > 0) {
      var result = this.props.result.map(function(element, index) {
        return(
          <tr key={index}>
            <td><a href={element.url} target="_blank" className="courseCode" data-content="點選可連結至學校課程系統，觀看課程大綱。">{element.code}</a></td>
            <td>{element.teacher}</td>
            <td>{element.chinese_name}</td>
            <td>{element.credit}</td>
            <td>{element.time}</td>
            <td>{element.degree}</td>
            <td><button className="ui green basic button" onClick={this.handleAdd.bind(this, element)} ref={"result-" + element.uid}>Add</button></td>
          </tr>
        )
      }.bind(this));

      return (
        <div className="ui">
          <h2 className="ui dividing header">搜尋結果</h2>
          <table className="ui striped table">
            <thead>
              <tr>
                <th className="one wide">課號</th>
                <th className="two wide">開課教師</th>
                <th className="three wide">課程名稱</th>
                <th className="one wide">學分</th>
                <th className="one wide">時間</th>
                <th className="one wide">可選年級</th>
                <th className="one wide">Add</th>
              </tr>
            </thead>
            <tbody>
              {result}
            </tbody>
          </table>
        </div>
      )
    } else {
      return (
        <div className="ui">
          <h2 className="ui dividing header">搜尋結果</h2>
          <div className="warning ui message">
            <div className="header">沒有符合條件的資料</div>
            <ul className="list">
              <li>關鍵字錯誤？（例如在課號中輸入課程名稱）</li>
              <li>嘗試減少關鍵字，改用系所和年級查詢</li>
            </ul>
          </div>
        </div>
      )
    }

  },
  componentDidUpdate: function() {
    $('.courseCode')
      .popup({
        position: 'bottom center'
      })
    ;
  }
});

$(document).ready(function() {
  $('.menu .item')
    .tab()
  ;
});
